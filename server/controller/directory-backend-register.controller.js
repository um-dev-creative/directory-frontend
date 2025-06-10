const appConfig = require('../config/app.config');
const {getApiEndpoint, createRequestOption, getAuthBasicHeader} = require("../shared/common-function");
const {API_SERVICE_DIRECTORY_MAP, API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH
} = require("../shared/oauth-common-function");
const schemesList = ["http:", "https:"];
const domainsList = ["prx-qa.backbone.tst", "prx-qa.manager.tst", "localhost"];
const constants = require("../config/constants.util");
const axios = require("axios");
const logger = appConfig.getLoggerApp();
const {TRANSFER_ENCODING, SESSION_TOKEN_BKD,
  API_INVALID_URL_REQUEST_TITLE, CONTENT_TYPE_DEFAULT, CONTENT_TYPE,
  POST_METHOD,
  PASSWORD_ATTRIBUTE, INNER_REGISTER_PATH
} = require("../config/constants.util");
const CryptoJS = require("crypto-js");
const cKey = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_IV);
const directoryRegisterProxyConfig = appConfig.getDirectoryVerifyCodeProxyConfig()
const { getUserSession } = require('../shared/user-session-store');

/**
 * Registers the proxy API for Directory service.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const registerProxyApi = async (req, res, next) => {
  let response = null;
  const apiURL = getApiEndpoint(req.url, directoryRegisterProxyConfig, API_SERVICE_DIRECTORY_MAP);
  const validationSchema = schemesList.includes(new URL(apiURL).protocol) && domainsList.includes(new URL(apiURL).hostname);

  if (validationSchema) {
    try {
      // Get session data for the user
      const sessionData = getUserSession(req.body['userId']);

      const headers = getRequestHeader(req, sessionData, constants.CONTENT_TYPE_DEFAULT, constants.CONTENT_TYPE_DEFAULT);
      logger.info(`[DIS] Proxying request to ${apiURL}`);
      let httpOptions = createRequestOption(req.method, apiURL, req.body, headers);
      let axiosResponse = await axios(httpOptions);
      delete axiosResponse.headers[TRANSFER_ENCODING];
      response = axiosResponse.data;
      res.set(axiosResponse.headers);
      // Include the session-token-bkd in the response headers
      if (sessionData.backboneSession && req.url === API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH) {
        res.set(SESSION_TOKEN_BKD, sessionData.backboneSession);
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
 * @param sessionData - The session data for the user.
 * @param {string} defaultAccept - The default Accept header value.
 * @param {string} defaultContentType - The default Content-Type header value.
 * @returns {Object} - The constructed headers.
 */
const getRequestHeader = function (req, sessionData, defaultAccept, defaultContentType) {
  let headers = getAuthBasicHeader(req, sessionData, defaultAccept);
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
