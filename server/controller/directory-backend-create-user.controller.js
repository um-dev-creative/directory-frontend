const Ajv = require('ajv');
const CryptoJS = require("crypto-js");
const axios = require('axios');
const appConfig = require('../config/app.config');
const constants = require('../config/constants.util.js');
const directoryCreateUserProxyConfig = appConfig.getDirectoryCreateUserProxyConfig();
const logger = appConfig.getLoggerApp();
const cKey = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_IV);

const {
  getRegex, getApiEndpoint, decodeJwtToken, createRequestOption,  getAuthBasicHeader
} = require("../shared/common-function");

const schemesList = ["http:", "https:"];
const domainsList = ["prx-qa.backbone.tst", "prx-qa.manager.tst", "localhost"];
const {getOAuthClient} = require("../proxy/oauth-client");
const {backboneSessionToken} = require("./backbone.controller");
const { getUserSession, setUserSession } = require('../shared/user-session-store');

const ajv = new Ajv();
ajv.addFormat('uuid', getRegex())
ajv.addSchema({type: 'string', format: 'uuid'}, 'schema');
const {
  SESSION_TOKEN_BKD,
  CONTENT_TYPE,
  CONTENT_TYPE_DEFAULT,
  API_INVALID_URL_REQUEST_TITLE,
  POST_METHOD,
  TRANSFER_ENCODING, PASSWORD_ATTRIBUTE, INNER_AUTH_PATH,
  BACKBONE_TOKEN_RELATIVE_PATH, DS_AUTH_RELATIVE_PATH, INNER_CREATE_USER_PATH
} = require("../config/constants.util");
const {
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_GRANT_TYPE,
  OAUTH_TOKEN_URL,
  OAUTH_AUTHENTICATION_TYPE,
  OAUTH_USER_ALIAS,
  OAUTH_USER_PASSWORD,
  API_SERVICE_DIRECTORY_MAP
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
 * Retrieves the OAuth client instance, initializing it if necessary.
 *
 * @returns {Object} - The OAuth client instance.
 */
let getOauthClient = function (oauthClientConfig) {
  let oauthClient;
  oauthClient = getOAuthClient(oauthClientConfig);
  return oauthClient;
};

async function getDirectorySessionToken(req) {
  const userId = req.body.alias;
  let session = getUserSession(userId);
  if (session && session.directorySession && session.dsBearToken && session.directorySessionExpiresAt > Date.now()) {
    return { directorySession: session.directorySession, dsBearToken: session.dsBearToken };
  }
  const dsBearToken = await getOauthClient(directoryOauthClientConfig).getBearerToken();
  setUserSession(userId, {
    ...session,
    directorySession: dsBearToken,
    dsBearToken,
    directorySessionExpiresAt: Date.now() + 60 * 60 * 1000 // 1 hora
  });
  return { directorySession: dsBearToken, dsBearToken };
}

/**
 * Proxies API requests to the appropriate backend services.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const proxyApi = async (req, res, next) => {
  let response = null;
  const apiURL = getApiEndpoint(req.url, directoryCreateUserProxyConfig, API_SERVICE_DIRECTORY_MAP);
  const validationSchema = schemesList.includes(new URL(apiURL).protocol) && domainsList.includes(new URL(apiURL).hostname);

  if (validationSchema) {
    try {
      // Obtener y reutilizar tokens de sesión y de aplicación para Directory Backend
      const { directorySession, dsBearToken } = await getDirectorySessionToken(req);
      // Obtener el token de sesión de backbone (ya cacheado en backbone.controller.js)
      const backboneSessionData = await backboneSessionToken(req);
      // Construir headers
      const headers = getRequestHeader(req, dsBearToken, backboneSessionData.backboneSession, constants.CONTENT_TYPE_DEFAULT, constants.CONTENT_TYPE_DEFAULT);
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
      res.set(axiosResponse.headers);

      // Include the session-token-bkd in the response headers
      if (backboneSessionData && req.url === INNER_AUTH_PATH) {
        res.set(SESSION_TOKEN_BKD, backboneSessionData.backboneSession);
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
  let headers = getAuthBasicHeader(req, authBearToken, backboneSession, defaultAccept);
  const contentType = req.header(CONTENT_TYPE);
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

module.exports = {
  proxyApi
};
