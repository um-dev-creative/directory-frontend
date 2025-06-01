const appConfig = require('../config/app.config');
const constants = require('../config/constants.util.js');
const axios = require('axios');
const authDirectoryProxyConfig = appConfig.getAuthDirectoryProxyConfig();
const directoryProxyConfig = appConfig.getDirectoryProxyConfig();
const logger = appConfig.getLoggerApp();
const {v4: uuidv4} = require('uuid');
const CryptoJS = require("crypto-js");
const cKey = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_IV);
const Ajv = require('ajv');

const {getRegex, getApiEndpoint, decodeJwtToken, createRequestOption, isValidUUID, isValidBearerToken} = require("../shared/common-function");

const schemesList = ["http:", "https:"];
const domainsList = ["prx-qa.backbone.tst", "prx-qa.manager.tst", "localhost"];

const ajv = new Ajv();
ajv.addFormat('uuid', getRegex())
ajv.addSchema({type: 'string', format: 'uuid'}, 'schema');
const {
  AUTHORIZATION,
  BEARER,
  SESSION_TOKEN_BKD,
  SESSION_TOKEN_DIR,
  FID_LOGGER_TRACKING_ID,
  CONTENT_TYPE,
  FID_USER_ID,
  CONTENT_TYPE_DEFAULT,
  ACCEPT,
  API_INVALID_URL_REQUEST_TITLE
} = require("../config/constants.util");
const {getOAuthClient} = require("../proxy/oauth-client");
const {backboneSessionToken} = require("./backbone.controller");
const {OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_GRANT_TYPE, OAUTH_TOKEN_URL, OAUTH_AUTHENTICATION_TYPE,
  OAUTH_USER_ALIAS, OAUTH_USER_PASSWORD, API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH, API_SERVICE_DIRECTORY_MAP
} = require("../shared/oauth-common-function");

/**
 * Jobs OAuth client configuration.
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
 * Retrieves the OAuth client instance, initializing it if necessary.
 *
 * @returns {Object} - The OAuth client instance.
 */
let getOauthClient = function (oauthClientConfig) {
  let oauthClient;
  oauthClient = getOAuthClient(oauthClientConfig);
  return oauthClient;
};

/**
 * Proxies API requests to the appropriate backend services.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const proxyApi = async (req, res, next) => {
  let response = null;
  const apiURL = getApiEndpoint(req.url, authDirectoryProxyConfig, API_SERVICE_DIRECTORY_MAP);
  const validationSchema = schemesList.includes(new URL(apiURL).protocol) && domainsList.includes(new URL(apiURL).hostname);

  if (validationSchema) {
    try {
      // Get the (keycloak) OAuth client token - this is used to authenticate the request to the directory services
      const authBearToken = await getOauthClient(directoryOauthClientConfig).getBearerToken();
      // Get the backbone session token
      const backboneSession = await backboneSessionToken(req);
      // Construct the request headers for directory backend services
      const headers = getRequestHeader(req, authBearToken, backboneSession, constants.CONTENT_TYPE_DEFAULT, constants.CONTENT_TYPE_DEFAULT);
      // Trace
      logger.info(`[DIS] Proxying request to ${apiURL}`);
      let httpOptions;
      if (apiURL.indexOf('/api/v1/auth/token') > 0) {
        let alias = decodeJwtToken(backboneSession);
        let pAlias = req.body['password'];
        httpOptions = createRequestOption(req.method, apiURL, {alias: alias, password: pAlias}, headers);
      } else {
        httpOptions = createRequestOption(req.method, apiURL, req.body, headers);
      }

      let axiosResponse = await axios(httpOptions);
      delete axiosResponse.headers['transfer-encoding'];
      response = axiosResponse.data;
      res.set(axiosResponse.headers);

      // Include the session-token-bkd in the response headers
      if (backboneSession && req.url === API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH) {
        res.set(SESSION_TOKEN_BKD, backboneSession);
      }
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

const proxyApiUserRegister = async (req, res, next) => {
  let response = null;
  const apiURL = getApiEndpoint(req.url, directoryProxyConfig, API_SERVICE_DIRECTORY_MAP);
  const validationSchema = schemesList.includes(new URL(apiURL).protocol) && domainsList.includes(new URL(apiURL).hostname);

  if (validationSchema) {
    try {
      // Get the (keycloak) OAuth client token - this is used to authenticate the request to the directory services
      const authBearToken = await getOauthClient(directoryOauthClientConfig).getBearerToken();
      // Get the backbone session token
      const backboneSession = await backboneSessionToken(req);
      // Construct the request headers for directory backend services
      const headers = getRequestHeader(req, authBearToken, backboneSession, constants.CONTENT_TYPE_DEFAULT, constants.CONTENT_TYPE_DEFAULT);
      // Trace
      logger.info(`[DIS] Proxying request to ${apiURL}`);
      let httpOptions = createRequestOption(req.method, apiURL, req.body, headers);

      let axiosResponse = await axios(httpOptions);
      delete axiosResponse.headers['transfer-encoding'];
      response = axiosResponse.data;
      res.set(axiosResponse.headers);

      // Include the session-token-bkd in the response headers
      if (backboneSession && req.url === API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH) {
        res.set(SESSION_TOKEN_BKD, backboneSession);
      }
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
}

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
  let headers = getBasicHeader(req, authBearToken, backboneSession, defaultAccept);
  const contentType = req.header(CONTENT_TYPE);
  if (req.url === '/api/v1/users' || req.url === API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH && req.method === 'POST') {
    req.body['password'] = CryptoJS.AES.encrypt(req.body.password, cKey, {iv: iv}).toString();
  }
  if (contentType !== null && contentType === CONTENT_TYPE_DEFAULT) {
    headers[CONTENT_TYPE] = CONTENT_TYPE_DEFAULT;
  } else {
    headers[CONTENT_TYPE] = defaultContentType;
  }
  return headers;
};

/**
 * Constructs the basic headers for the proxied request.
 * @param req - The request object.
 * @param bearerToken - The token for the directory services.
 * @param backboneSession - The session token for the backbone services.
 * @param defaultAccept - The default Accept header value.
 * @returns {{}} - The constructed headers.
 */
const getBasicHeader = function (req, bearerToken, backboneSession, defaultAccept) {
  let headers = {};
  const fidLoggerTrackingId = req.header(FID_LOGGER_TRACKING_ID);
  const userId = req.header(FID_USER_ID);
  const sessionTokenBkd = req.header(SESSION_TOKEN_BKD);
  const accept = req.header(ACCEPT);
  const sessionToken = req.header(SESSION_TOKEN_DIR);
  if (fidLoggerTrackingId !== null && isValidUUID(fidLoggerTrackingId)) {
    headers[FID_LOGGER_TRACKING_ID] = fidLoggerTrackingId;
  } else {
    headers[FID_LOGGER_TRACKING_ID] = uuidv4();
  }

  if (userId !== null && isValidUUID(userId)) {
    headers[FID_USER_ID] = fidLoggerTrackingId;
  } else {
    headers[FID_USER_ID] = "anonymous";
  }
  headers[AUTHORIZATION] = BEARER + bearerToken;

  if (accept && accept === ACCEPT) {
    headers[ACCEPT] = accept;
  } else {
    headers[ACCEPT] = defaultAccept
  }

  if (sessionTokenBkd !== null && isValidBearerToken(sessionTokenBkd)) {
    headers[SESSION_TOKEN_BKD] = sessionTokenBkd;
  }

  if (backboneSession) {
    headers[SESSION_TOKEN_BKD] = backboneSession;
  }

  if (sessionToken) {
    headers[SESSION_TOKEN_DIR] = sessionToken;
  }

  return headers;
};

module.exports = {
  proxyApi
};
