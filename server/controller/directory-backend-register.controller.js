const appConfig = require('../config/app.config');
const {getApiEndpoint, createRequestOption, getAuthBasicHeader} = require("../shared/common-function");
const {API_SERVICE_DIRECTORY_MAP, API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET,
  OAUTH_GRANT_TYPE, OAUTH_TOKEN_URL, OAUTH_AUTHENTICATION_TYPE, OAUTH_USER_ALIAS, OAUTH_USER_PASSWORD
} = require("../shared/oauth-common-function");
const schemesList = ["http:", "https:"];
const domainsList = ["prx-qa.backbone.tst", "prx-qa.manager.tst", "localhost"];
const {getOAuthClient} = require("../proxy/oauth-client");
const {backboneSessionToken} = require("./backbone.controller");
const constants = require("../config/constants.util");
const axios = require("axios");
const logger = appConfig.getLoggerApp();
const {TRANSFER_ENCODING, SESSION_TOKEN_BKD, API_INVALID_URL_REQUEST_TITLE, CONTENT_TYPE_DEFAULT, CONTENT_TYPE,
  DIR_USER_RELATIVE_PATH,
  POST_METHOD,
  PASSWORD_ATTRIBUTE, INNER_REGISTER_PATH
} = require("../config/constants.util");
const CryptoJS = require("crypto-js");
const cKey = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_IV);
const directoryRegisterProxyConfig = appConfig.getDirectoryVerifyCodeProxyConfig()
const { getUserSession, setUserSession } = require('../shared/user-session-store');

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

async function getDirectorySessionToken(req) {
  const userId = req.body.alias || req.body.email;
  let session = getUserSession(userId);
  if (session && session.directorySession && session.dsBearToken && session.directorySessionExpiresAt > Date.now()) {
    return { directorySession: session.directorySession, dsBearToken: session.dsBearToken };
  }
  const dsBearToken = await getOAuthClient(directoryOauthClientConfig).getBearerToken();
  setUserSession(userId, {
    ...session,
    directorySession: dsBearToken,
    dsBearToken,
    directorySessionExpiresAt: Date.now() + 60 * 60 * 1000 // 1 hora
  });
  return { directorySession: dsBearToken, dsBearToken };
}

const registerProxyApi = async (req, res, next) => {
  let response = null;
  const apiURL = getApiEndpoint(req.url, directoryRegisterProxyConfig, API_SERVICE_DIRECTORY_MAP);
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
      let httpOptions = createRequestOption(req.method, apiURL, req.body, headers);
      let axiosResponse = await axios(httpOptions);
      delete axiosResponse.headers[TRANSFER_ENCODING];
      response = axiosResponse.data;
      res.set(axiosResponse.headers);
      // Include the session-token-bkd in the response headers
      if (backboneSessionData && req.url === API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH) {
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
  let headers = getAuthBasicHeader(req, authBearToken, backboneSession, defaultAccept);
  const contentType = req.header(CONTENT_TYPE);

  if (req.url === INNER_REGISTER_PATH && req.method === POST_METHOD) {
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
  registerProxyApi
};
