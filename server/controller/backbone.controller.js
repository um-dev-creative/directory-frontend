/**
 * OAuth client instance.
 * @type {Object|null}
 */
let backboneClient = null;

const appConfig = require('../config/app.config');
const constants = require('../config/constants.util.js');
const {getOAuthClient} = require("../proxy/oauth-client");
const axios = require('axios');
const jobsProxyConfig = appConfig.getDirectoryProxyConfig();
const backboneclient = require('../proxy/backbone-client');
const logger = appConfig.getLoggerApp();
const {v4: uuidv4} = require('uuid');
const CryptoJS = require("crypto-js");
const cKey = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_IV);
const Ajv = require('ajv');
const {isValidUUID, getRegex, decodeJwtToken, createRequestOption} = require("../shared/common-function");

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
const domainsList = ["prx-qa.backbone.tst", "prx-qa.manager.tst", "localhost"];

// const HttpsAgent = require('agentkeepalive').HttpsAgent;
const ajv = new Ajv();
ajv.addFormat('uuid', getRegex())
ajv.addSchema({type: 'string', format: 'uuid'}, 'schema');
// const Agent = require('agentkeepalive');
const {
  AUTHORIZATION, BEARER, SESSION_TOKEN_BKD, SESSION_TOKEN_DIR, FID_LOGGER_TRACKING_ID, CONTENT_TYPE,
  FID_USER_ID, CONTENT_TYPE_DEFAULT, ACCEPT, API_INVALID_URL_REQUEST_TITLE,
  BACKBONE_TOKEN_RELATIVE_PATH
} = require("../config/constants.util");
const {API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH} = require("../shared/oauth-common-function");

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
 * HTTP connection options.
 * @type {{maxFreeSockets: number, keepAlive: boolean, maxSockets: number, freeSocketTimeout: number, timeout: number}}
 */
const httpConnectionOptions = {
  keepAlive: true,
  maxSockets: 100,
  maxFreeSockets: 10,
  timeout: 60000,
  freeSocketTimeout: 30000
};

/**
 * Retrieves the backbone client instance, initializing it if necessary.
 * @returns {Object} - The backbone client instance.
 */
let getBackboneClient = function () {
  let backboneApiURL = BACKBONE_API_SERVICE_MAP['backbone'] + BACKBONE_TOKEN_RELATIVE_PATH;
  if (backboneClient) {
    return backboneClient;
  }
  backboneClient = backboneclient.getBackbone({
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
const backboneSessionToken = async (req) => {
  let backboneSession = null;
  if (req.url === API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH) {
    const backboneToken = await getOAuthClient(backboneOauthClientConfig).getBearerToken();
    backboneSession = await getBackboneClient().getToken(req.body.alias,
      CryptoJS.AES.encrypt(req.body.password, cKey, {iv: iv}).toString(), APPLICATION_ID, backboneToken);
  }
  return backboneSession?.token;
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
  const apiURL = getApiEndpoint(req.url);
  if (schemesList.includes(new URL(apiURL).protocol) && domainsList.includes(new URL(apiURL).hostname)) {
    try {
      // Get the (keycloak) OAuth client token
      let authBearToken = await getOAuthClient(directoryOauthClientConfig).getBearerToken();
      // Get the backbone session token
      let backboneSession = await backboneSessionToken(req);
      let headers = getRequestHeader(req, authBearToken, backboneSession, constants.CONTENT_TYPE_DEFAULT, constants.CONTENT_TYPE_DEFAULT);
      // Trace
      logger.info(`[DIS] Proxying request to ${apiURL}`);
      let httpOptions;
      if(apiURL.indexOf('/api/v1/auth/token') > 0) {
        let alias = decodeJwtToken(backboneSession);
        httpOptions = createRequestOption(req.method, apiURL, {alias: alias}, headers);
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
  const accept = req.header(ACCEPT);
  const uuidValid =  isValidUUID(fidLoggerTrackingId);
  if (fidLoggerTrackingId !== null && uuidValid) {
    headers[FID_LOGGER_TRACKING_ID] = fidLoggerTrackingId;
  } else {
    headers[FID_LOGGER_TRACKING_ID] = uuidv4();
  }
  if (userId !== null && uuidValid) {
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

  return headers;
};

const bearerTokenRegex = /^Bearer\s[a-zA-Z0-9\-._~+/]+=*$/;

function isValidBearerToken(token) {
  return bearerTokenRegex.test(token);
}

module.exports = {
  proxyApi,
  backboneSessionToken
};
