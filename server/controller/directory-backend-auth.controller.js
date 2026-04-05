const Ajv = require('ajv');
const CryptoJS = require("crypto-js");
const axios = require('axios');
const appConfig = require('../config/app.config');
const constants = require('../config/constants.util.js');
const oauthCommonFunction = require("../shared/oauth-common-function");
const directoryAuthProxyConfig = appConfig.getDirectoryAuthProxyConfig();
const logger = appConfig.getLoggerApp();
const cKey = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_IV);
const LOGGER_TAG_ID = `[${constants.LOGGER_TAG_DIRECTORY_BACKEND_AUTH}] :::`;

const {
  getRegex, getApiEndpoint, decodeJwtToken, createRequestOption, getAuthBasicHeader
} = require("../shared/common-function");

const schemesList = ["http:", "https:"];
const domainsList = ["directory-backend", "backbone-rest", "prx-qa.backbone.tst", "prx-qa.manager.tst", "localhost"];
const {backboneSessionToken} = require("./backbone.controller");
const {setUserSession, removeUserSession} = require('../shared/user-session-store');

const ajv = new Ajv();
ajv.addFormat('uuid', getRegex())
ajv.addSchema({type: 'string', format: 'uuid'}, 'schema');

/**
 * Directory OAuth client configuration.
 * @type {{password: string, clientId: string, tokenUrl: string, clientSecret: string, authenticationType: string, grantType: string, username: string}}
 */
const directoryOauthClientConfig = {
  clientId: oauthCommonFunction.OAUTH_CLIENT_ID,
  clientSecret: oauthCommonFunction.OAUTH_CLIENT_SECRET,
  grantType: oauthCommonFunction.OAUTH_GRANT_TYPE,
  tokenUrl: oauthCommonFunction.OAUTH_TOKEN_URL,
  authenticationType: oauthCommonFunction.OAUTH_AUTHENTICATION_TYPE,
  username: oauthCommonFunction.OAUTH_USER_ALIAS,
  password: oauthCommonFunction.OAUTH_USER_PASSWORD
};

/**
 * Proxies API requests to the appropriate backend services.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const proxyApi = async (req, res) => {
  logger.info(`${LOGGER_TAG_ID} Proxying request to ${req.url}`);
  let response = null;
  const apiURL = getApiEndpoint(req.url, directoryAuthProxyConfig, oauthCommonFunction.API_SERVICE_DIRECTORY_MAP);
  logger.debug(`${LOGGER_TAG_ID} API URL: ${apiURL}`);
  const validationSchema = schemesList.includes(new URL(apiURL).protocol) && domainsList.includes(new URL(apiURL).hostname);


  // TODO - Incluir validacion de negocio


  let sessionData = {
    directorySession: null,
    directoryBearerToken: null,
    directorySessionExpiresAt: null,
    backboneSession: null,
    backboneBearerToken: null,
    backboneSessionExpiresAt: null
  };
  logger.debug(`${LOGGER_TAG_ID} Validation schema: ${validationSchema}`);
  if (validationSchema) {
    try {
      logger.debug(`${LOGGER_TAG_ID} Validating API URL: ${apiURL}`);
      // Get the backbone session token (already cached in backbone.controller.js)
      const backboneSessionData = await backboneSessionToken(req);
      // Get and reuse session and application tokens for Directory Backend
      const userId = oauthCommonFunction.getUserId(backboneSessionData.backboneSession);
      logger.info(`${LOGGER_TAG_ID} User ID: ${userId}`);
      const directorySessionData = await oauthCommonFunction.getDirectorySessionToken(req, directoryOauthClientConfig);
      // Construct headers
      sessionData.directorySession = directorySessionData.directorySession;
      sessionData.directoryBearerToken = directorySessionData.directoryBearerToken;
      sessionData.directorySessionExpiresAt = directorySessionData.directorySessionExpiresAt;
      sessionData.backboneSession = backboneSessionData.backboneSession;
      sessionData.backboneBearerToken = backboneSessionData.backboneBearerToken;
      sessionData.backboneSessionExpiresAt = backboneSessionData.backboneSessionExpiresAt;
      logger.debug(`${LOGGER_TAG_ID} Session data: ${JSON.stringify(sessionData)}`);
      // Construct headers for the request
      const headers = getRequestHeader(req, sessionData, constants.CONTENT_TYPE_APPLICATION_JSON, constants.CONTENT_TYPE_APPLICATION_JSON);
      logger.debug(`${LOGGER_TAG_ID} Proxying request to ${apiURL}`);
      let httpOptions;
      if (apiURL.indexOf(constants.DS_AUTH_RELATIVE_PATH) > 0) {
        let alias = decodeJwtToken(backboneSessionData.backboneSession);
        let pAlias = req.body[constants.PASSWORD_ATTRIBUTE];
        httpOptions = createRequestOption(req.method, apiURL, {alias: alias, password: pAlias}, headers);
      } else {
        httpOptions = createRequestOption(req.method, apiURL, req.body, headers);
      }

      logger.debug(`${LOGGER_TAG_ID} HTTP Options: ${JSON.stringify(httpOptions)}`);
      let axiosResponse = await axios(httpOptions);
      delete axiosResponse.headers[constants.TRANSFER_ENCODING];
      response = axiosResponse.data;
      directorySessionData.sessionToken = response.token;
      res.set(axiosResponse.headers);

      // Include the session-token-bkd in the response headers
      if (backboneSessionData && req.url === constants.INNER_ACCESS_TOKEN_PATH) {
        logger.debug(`${LOGGER_TAG_ID} Setting session token headers for user ${userId}`);
        res.set(constants.SESSION_TOKEN_BKD, backboneSessionData.backboneSession);
        res.set(constants.AUTHORIZATION, directorySessionData.directoryBearerToken);
      }
      logger.debug(`${LOGGER_TAG_ID} Response data: ${JSON.stringify(response)}`);
      sessionData.directorySession = directorySessionData.directorySession;
      setUserSession(userId, req.body.alias, sessionData);
      logger.debug(`${LOGGER_TAG_ID} Session data set for user ${userId}`);
    } catch (error) {
      if (error.response != null) {
        logger.error(`${LOGGER_TAG_ID} Error in proxied request: ${error.message}`);
        response = error.response.data;
        res.status(error.response.status);
      } else if (error.errors != null) {
        logger.error(`${LOGGER_TAG_ID} Validation errors: ${error.errors}`);
        response = error;
        res.status(constants.HTTP_STATUS_CODE_500_SERVER_ERROR);
      }
    }
    logger.info(`${LOGGER_TAG_ID} Sending response: ${JSON.stringify(response)}`);
    res.send(response);
  } else {
    logger.error(`${LOGGER_TAG_ID} Invalid API URL request: ${req.url}`);
    res.send(constants.API_INVALID_URL_REQUEST_TITLE);
  }
};

/**
 * Constructs the basic headers for the proxied request.
 *
 * @param {Object} req - The request object.
 * @param userSession - The user session object containing tokens.
 * @param {string} defaultAccept - The default Accept header value.
 * @param {string} defaultContentType - The default Content-Type header value.
 * @returns {Object} - The constructed headers.
 */
const getRequestHeader = function (req, userSession, defaultAccept, defaultContentType) {
  let headers = getAuthBasicHeader(req, userSession, defaultAccept);

  logger.debug(`${LOGGER_TAG_ID} Headers before content type: ${JSON.stringify(headers)}`);
  const contentType = req.header(constants.CONTENT_TYPE) ?? null;

  if (req.url === constants.INNER_ACCESS_TOKEN_PATH ||
    logic.isValidUUID(req.body[constants.APPLICATION_ID_ATTRIBUTE]) ||
    req.url === constants.INNER_CREATE_USER_PATH &&
    req.method === constants.POST_METHOD) {
    req.body[constants.PASSWORD_ATTRIBUTE] = CryptoJS.AES.encrypt(req.body.password, cKey, {iv: iv}).toString();
  }

  if (contentType !== null && contentType === constants.CONTENT_TYPE_APPLICATION_JSON) {
    logger.debug(`${LOGGER_TAG_ID} Setting Content-Type to application/json`);
    headers[constants.CONTENT_TYPE] = constants.CONTENT_TYPE_APPLICATION_JSON;
  } else {
    logger.debug(`${LOGGER_TAG_ID} Setting Content-Type to default: ${defaultContentType}`);
    headers[constants.CONTENT_TYPE] = defaultContentType;
  }
  logger.info(`${LOGGER_TAG_ID} Final headers: ${JSON.stringify(headers)}`);
  return headers;
};

/**
 * Closes the user session by removing it from the session store.
 * This function is called when the user logs out or when the session
 * needs to be terminated.
 *
 * @param req - The request object containing the session token.
 * @param res - The response object to send the result.
 */
function closeSession(req, res) {
  const backboneToken = req.headers[constants.SESSION_TOKEN_BKD];
  const userId = oauthCommonFunction.getUserId(backboneToken)
  logger.info(`${LOGGER_TAG_ID} Closing session for user ID: ${userId}`);
  removeUserSession(userId);
  res.status(constants.HTTP_STATUS_CODE_200_OK).send({message: 'Session closed successfully'});
}

module.exports = {
  proxyApi,
  closeSession
};
