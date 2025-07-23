/**
 * OAuth client instance.
 * @type {Object|null}
 */
let backboneClient = null;

const appConfig = require('../config/app.config');
const constants = require('../config/constants.util.js');
const {getOAuthClient} = require("../proxy/oauth-client");
const axios = require('axios');
const backboneClientConnector = require('../proxy/backbone-client');
const logger = appConfig.getLoggerApp();
const CryptoJS = require("crypto-js");
const cKey = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_IV);
const Ajv = require('ajv');
const authDirectoryProxyConfig = appConfig.getDirectoryAuthProxyConfig();
const commonFunction = require("../shared/common-function");
const userSessionStore = require('../shared/user-session-store');
const LOGGER_TAG_ID = `[${constants.LOGGER_TAG_BACKBONE_CONTROLLER}] :::`;

const APPLICATION_ID = process.env.APPLICATION_ID;

const BACKBONE_API_SERVICE_MAP = JSON.parse(process.env.BACKBONE_API_SERVICE_MAP);
const BACKBONE_OAUTH_AUTHENTICATION_TYPE = process.env.BACKBONE_AUTH_AUTHENTICATION_TYPE;
const BACKBONE_OAUTH_CLIENT_ID = process.env.BACKBONE_AUTH_CLIENT_ID;
const BACKBONE_OAUTH_CLIENT_SECRET = process.env.BACKBONE_AUTH_CLIENT_SECRET;
const BACKBONE_OAUTH_GRANT_TYPE = process.env.BACKBONE_AUTH_GRANT_TYPE;
const BACKBONE_OAUTH_TOKEN_URL = process.env.BACKBONE_AUTH_SERVER_URI;
const BACKBONE_OAUTH_USER_ALIAS = process.env.BACKBONE_AUTH_USER_ALIAS;
const BACKBONE_OAUTH_USER_PASSWORD = process.env.BACKBONE_AUTH_USER_PASSWORD;

const schemesList = ["http:", "https:"];
const domainsList = ["directory-backend", "backbone-rest", "prx-qa.backbone.tst", "prx-qa.manager.tst", "localhost"];
const ajv = new Ajv();
ajv.addFormat('uuid', commonFunction.getRegex());
ajv.addSchema({type: 'string', format: 'uuid'}, 'schema');

const {API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH, getUserId} = require("../shared/oauth-common-function");

/**
 * Backbone OAuth client configuration.
 * @type {{password: string, clientId: string, tokenUrl: string, clientSecret: string, authenticationType: string, grantType: string, username: string}}
 */
const backboneOauthClientConfig = {
  clientId: BACKBONE_OAUTH_CLIENT_ID,
  clientSecret: BACKBONE_OAUTH_CLIENT_SECRET,
  grantType: BACKBONE_OAUTH_GRANT_TYPE,
  tokenUrl: BACKBONE_OAUTH_TOKEN_URL,
  authenticationType: BACKBONE_OAUTH_AUTHENTICATION_TYPE,
  username: BACKBONE_OAUTH_USER_ALIAS,
  password: BACKBONE_OAUTH_USER_PASSWORD
};

/**
 * Retrieves the backbone client instance, initializing it if necessary.
 * @returns {Object} - The backbone client instance.
 */
let getBackboneClient = function (relativePath) {
  let backboneApiURL = BACKBONE_API_SERVICE_MAP['backbone'] + relativePath;
  if (backboneClient) {
    backboneClient.url = backboneApiURL;
    return backboneClient;
  }
  backboneClient = backboneClientConnector.getInstance({
    url: backboneApiURL
  });
  return backboneClient;
};

/**
 * Retrieves the session token for the backbone services.
 *
 * @param req - The request object.
 * @returns {Promise<*>} - The session token.
 */
const sessionToken = async (req) => {
  const alias = req.body.alias;
  let sessionData = {};
  // Check if the session already exists in the store
  logger.info(`${LOGGER_TAG_ID} Checking session for alias: ${alias}`);
  let session = userSessionStore.getUserSession(alias);
  if (session && session.backboneSession && session.backboneBearerToken && session.backboneSessionExpiresAt > Date.now()) {
    return {
      backboneSession: session.backboneSession,
      backboneBearerToken: session.backboneBearerToken,
      backboneSessionExpiresAt: session.backboneSessionExpiresAt
    };
  }
  logger.debug(`${LOGGER_TAG_ID} No valid session found for alias: ${alias}, creating a new one.`);
  const backboneBearerToken = await getOAuthClient(backboneOauthClientConfig).getBearerToken();
  logger.debug(`${LOGGER_TAG_ID} Obtained Backbone Bearer Token for alias: ${alias}`);
  sessionData = {
    backboneSession: null,
    backboneBearerToken: backboneBearerToken,
    backboneSessionExpiresAt: Date.now() + 60 * 60 * 1000 // 1 hora
  };
  if (req.url === constants.INNER_ACCESS_TOKEN_PATH) {
    logger.debug(`${LOGGER_TAG_ID} Creating Backbone session for alias: ${alias}`);
    const backboneSession = await getBackboneClient(constants.BACKBONE_TOKEN_RELATIVE_PATH).getToken(
      req.body.alias,
      CryptoJS.AES.encrypt(req.body.password, cKey, {iv: iv}).toString(),
      APPLICATION_ID,
      backboneBearerToken
    );
    sessionData.backboneSession = backboneSession.token;
    // Guarda la sesión en el store con expiración (ejemplo: 1 hora)
    userSessionStore.setUserSession(getUserId(backboneSession?.token), alias, sessionData);
  }
  logger.info(`${LOGGER_TAG_ID} Backbone session created for alias: ${alias}`);
  return sessionData;
};

/**
 * Generates a new token by renewing the Backbone session for a specific user.
 *
 * This asynchronous function retrieves the user's current session data and interacts with the Backbone service to renew the session token.
 * If successful, it updates the user's session with the new token. In case of an error, it logs the issue and throws an appropriate error message.
 *
 * @param {string} userId - The unique identifier of the user for whom the token is being generated.
 * @throws {Error} Throws an error if the Backbone session renewal fails, providing details from the backend response.
 */
const renewToken = async (userId) => {
  try {
    logger.debug(`${LOGGER_TAG_ID} Renewing Backbone session for user: ${userId}`);
    let sessionData = userSessionStore.getUserSession(userId);
    const response = await getBackboneClient(constants.BACKBONE_TOKEN_RENEW_RELATIVE_PATH)
      .getNewToken(sessionData.backboneBearerToken, sessionData.backboneSession);
    if (response) {
      logger.debug(`${LOGGER_TAG_ID} Successfully renewed Backbone session for user: ${userId}`);
      sessionData.backboneSession = response.token;
      userSessionStore.setUserSession(userId, null, sessionData);
      return response.token;
    }
  } catch (error) {
    if (error.response != null) {
      logger.error(`${LOGGER_TAG_ID} Error renewing Backbone session: ${error.response.data}`);
      throw new Error(error.response.data);
    }
  }
};

/**
 * Proxies API requests to the appropriate backend services.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const proxyApi = async (req, res) => {
  let response = null;
  const apiURL = commonFunction.getApiEndpoint(req.url);
  if (schemesList.includes(new URL(apiURL).protocol) && domainsList.includes(new URL(apiURL).hostname)) {
    try {
      logger.info(`${LOGGER_TAG_ID} Proxying request to ${req.url}`);
      // Get the (keycloak) OAuth client token
      let authBearToken = await getOAuthClient(authDirectoryProxyConfig).getBearerToken();
      // Get the backbone session token
      let backboneSession = await sessionToken(req);
      let headers = getRequestHeader(req, authBearToken, backboneSession, constants.CONTENT_TYPE_APPLICATION_JSON, constants.CONTENT_TYPE_APPLICATION_JSON);
      // Trace
      logger.info(`${LOGGER_TAG_ID} Proxying request to ${apiURL}`);
      let httpOptions;
      if (apiURL.indexOf(constants.DS_TOKEN_RELATIVE_PATH) > 0) {
        logger.info(`${LOGGER_TAG_ID} Requesting Backbone session token for alias: ${req.body.alias}`);
        let alias = commonFunction.decodeJwtToken(backboneSession);
        httpOptions = commonFunction.createRequestOption(req.method, apiURL, {alias: alias}, headers);
      } else {
        logger.info(`${LOGGER_TAG_ID} Requesting Backbone session token for alias: ${req.body.alias}`);
        httpOptions = commonFunction.createRequestOption(req.method, apiURL, req.body, headers);
      }

      logger.info(`${LOGGER_TAG_ID} HTTP Options: ${JSON.stringify(httpOptions)}`);
      let axiosResponse = await axios(httpOptions);

      logger.info(`${LOGGER_TAG_ID} Received response from ${apiURL}: ${axiosResponse.status}`);
      delete axiosResponse.headers[constants.TRANSFER_ENCODING];
      response = axiosResponse.data;
      res.set(axiosResponse.headers);

      logger.info(`${LOGGER_TAG_ID} Response data: ${JSON.stringify(response)}`);
      // Include the session-token-bkd in the response headers
      if (backboneSession && req.url === API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH) {
        res.set(constants.SESSION_TOKEN_BKD, backboneSession);
      }
    } catch (error) {
      if (error.response != null) {
        logger.error(`${LOGGER_TAG_ID} Error proxying request: ${error.response.data}`);
        response = error.response.data;
        res.status(error.response.status);
      } else if (error.errors != null) {
        logger.error(`${LOGGER_TAG_ID} Validation errors: ${JSON.stringify(error.errors)}`);
        response = error;
        res.status(500);
      }
    }
    res.send(response);
  } else {
    res.send(constants.API_INVALID_URL_REQUEST_TITLE);
  }
};

/**
 * Constructs the basic headers for the proxied request.
 *
 * @param {Object} req - The request object.
 * @param authBearToken - The token for the backend services.
 * @param backboneSession - The session token for the backbone services.
 * @param {string} defaultAccept - The default Accept header value.
 * @param {string} defaultContentType - The default Content-Type header value.
 * @returns {Object} - The constructed headers.
 */
const getRequestHeader = function (req, authBearToken, backboneSession, defaultAccept, defaultContentType) {
  let headers = commonFunction.getBasicHeader(req, authBearToken, defaultAccept);
  const contentType = req.header(constants.CONTENT_TYPE);

  if (contentType !== null && contentType === constants.CONTENT_TYPE_APPLICATION_JSON) {
    headers[constants.CONTENT_TYPE] = constants.CONTENT_TYPE_APPLICATION_JSON;
  } else {
    headers[constants.CONTENT_TYPE] = defaultContentType;
  }
  return headers;
};

module.exports = {
  proxyApi,
  backboneRenewToken: renewToken,
  backboneSessionToken: sessionToken
};
