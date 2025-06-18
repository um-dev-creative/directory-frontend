const Ajv = require('ajv');
const CryptoJS = require("crypto-js");
const axios = require('axios');
const appConfig = require('../config/app.config');
const constants = require('../config/constants.util.js');
const directoryAuthProxyConfig = appConfig.getDirectoryAuthProxyConfig();
const logger = appConfig.getLoggerApp();
const cKey = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_IV);

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
const {
  SESSION_TOKEN_BKD, CONTENT_TYPE,  CONTENT_TYPE_DEFAULT,
  API_INVALID_URL_REQUEST_TITLE, POST_METHOD, TRANSFER_ENCODING,
  PASSWORD_ATTRIBUTE, INNER_AUTH_PATH, DS_AUTH_RELATIVE_PATH,
  INNER_CREATE_USER_PATH
} = require("../config/constants.util");
const {
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_GRANT_TYPE,
  OAUTH_TOKEN_URL,
  OAUTH_AUTHENTICATION_TYPE,
  OAUTH_USER_ALIAS,
  OAUTH_USER_PASSWORD,
  API_SERVICE_DIRECTORY_MAP, getDirectorySessionToken, getUserId
} = require("../shared/oauth-common-function");

/**
 * Directory OAuth client configuration.
 * @type {{password: string, clientId: string, tokenUrl: string, clientSecret: string, authenticationType: string, grantType: string, username: string}}
 */
const directoryOauthClientConfig = {
  clientId: OAUTH_CLIENT_ID,
  clientSecret: OAUTH_CLIENT_SECRET,
  grantType: OAUTH_GRANT_TYPE,
  tokenUrl: OAUTH_TOKEN_URL,
  authenticationType: OAUTH_AUTHENTICATION_TYPE,
  username: OAUTH_USER_ALIAS,
  password: OAUTH_USER_PASSWORD
};

/**
 * Proxies API requests to the appropriate backend services.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const proxyApi = async (req, res, next) => {
  logger.info(`[DIS] Proxying request to ${req.url}`);
  let response = null;
  const apiURL = getApiEndpoint(req.url, directoryAuthProxyConfig, API_SERVICE_DIRECTORY_MAP);
  logger.info(`[DIS] API URL: ${apiURL}`);
  const validationSchema = schemesList.includes(new URL(apiURL).protocol) && domainsList.includes(new URL(apiURL).hostname);
  let sessionData = {
    directorySession: null,
    directoryBearerToken: null,
    directorySessionExpiresAt: null,
    backboneSession: null,
    backboneBearerToken: null,
    backboneSessionExpiresAt: null
  };
  logger.info(`[DIS] Validation schema: ${validationSchema}`);
  if (validationSchema) {
    try {
      logger.info(`[DIS] Validating API URL: ${apiURL}`);
      // Get the backbone session token (already cached in backbone.controller.js)
      const backboneSessionData = await backboneSessionToken(req);
      // Get and reuse session and application tokens for Directory Backend
      const userId = getUserId(backboneSessionData.backboneSession);
      logger.info(`[DIS] User ID: ${userId}`);
      const directorySessionData = await getDirectorySessionToken(req, directoryOauthClientConfig);
      // Construct headers
      sessionData.directorySession = directorySessionData.directorySession;
      sessionData.directoryBearerToken = directorySessionData.directoryBearerToken;
      sessionData.directorySessionExpiresAt = directorySessionData.directorySessionExpiresAt;
      sessionData.backboneSession = backboneSessionData.backboneSession;
      sessionData.backboneBearerToken = backboneSessionData.backboneBearerToken;
      sessionData.backboneSessionExpiresAt = backboneSessionData.backboneSessionExpiresAt;
      logger.info(`[DIS] Session data: ${JSON.stringify(sessionData)}`);
      // Construct headers for the request
      const headers = getRequestHeader(req, sessionData, constants.CONTENT_TYPE_DEFAULT, constants.CONTENT_TYPE_DEFAULT);
      logger.info(`[DIS] Proxying request to ${apiURL}`);
      let httpOptions;
      if (apiURL.indexOf(DS_AUTH_RELATIVE_PATH) > 0) {
        let alias = decodeJwtToken(backboneSessionData.backboneSession);
        let pAlias = req.body[PASSWORD_ATTRIBUTE];
        httpOptions = createRequestOption(req.method, apiURL, {alias: alias, password: pAlias}, headers);
      } else {
        httpOptions = createRequestOption(req.method, apiURL, req.body, headers);
      }

      let axiosResponse = await axios(httpOptions);
      delete axiosResponse.headers[TRANSFER_ENCODING];
      response = axiosResponse.data;
      directorySessionData.sessionToken = response.token;
      res.set(axiosResponse.headers);

      // Include the session-token-bkd in the response headers
      if (backboneSessionData && req.url === INNER_AUTH_PATH) {
        res.set(SESSION_TOKEN_BKD, backboneSessionData.backboneSession);
        res.set('authorization', directorySessionData.directoryBearerToken);
      }
      sessionData.directorySession = directorySessionData.directorySession;
      setUserSession(userId, req.body.alias, sessionData);
      logger.info(`[DIS] Session data set for user ${userId}`);
    } catch (error) {
      if (error.response != null) {
        response = error.response.data;
        res.status(error.response.status);
      } else if (error.errors != null) {
        response = error;
        res.status(500);
      }
    }
    res.send(response);
  } else {
    res.send(API_INVALID_URL_REQUEST_TITLE);
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

  const contentType = req.header(CONTENT_TYPE) ?? null;

  if (req.url === INNER_AUTH_PATH || req.url === INNER_CREATE_USER_PATH && req.method === POST_METHOD) {
    req.body[PASSWORD_ATTRIBUTE] = CryptoJS.AES.encrypt(req.body.password, cKey, {iv: iv}).toString();
  }

  if (contentType !== null && contentType === CONTENT_TYPE_DEFAULT) {
    headers[CONTENT_TYPE] = CONTENT_TYPE_DEFAULT;
  } else {
    headers[CONTENT_TYPE] = defaultContentType;
  }
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
  const backboneToken = req.headers[SESSION_TOKEN_BKD];
  const userId = getUserId(backboneToken)
  removeUserSession(userId);
  res.status(200).send({message: 'Session closed successfully'});
}

module.exports = {
  proxyApi,
  closeSession
};
