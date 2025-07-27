const appConfig = require('../config/app.config');
const {getApiEndpoint, createRequestOption, getAuthBasicHeader} = require("../shared/common-function");
const {API_SERVICE_DIRECTORY_MAP, API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH
} = require("../shared/oauth-common-function");
const schemesList = ["http:", "https:"];
const domainsList = ["directory-backend", "backbone-rest", "prx-qa.backbone.tst", "prx-qa.manager.tst", "localhost"];
const constants = require("../config/constants.util");
const axios = require("axios");
const logger = appConfig.getLoggerApp();
const CryptoJS = require("crypto-js");
const cKey = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_IV);
const directoryRegisterProxyConfig = appConfig.getDirectoryVerifyCodeProxyConfig()
const { getUserSession } = require('../shared/user-session-store');
const LOGGER_TAG_ID = `[${constants.LOGGER_TAG_DIRECTORY_BACKEND_REGISTER}] :::`;

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
  logger.info(`${LOGGER_TAG_ID} API URL: ${apiURL}`);

  if (validationSchema) {
    try {
      logger.debug(`${LOGGER_TAG_ID} Validating API URL: ${apiURL}`);
      // Get session data for the user
      const sessionData = getUserSession(req.body['userId']);

      const headers = getRequestHeader(req, sessionData, constants.CONTENT_TYPE_APPLICATION_JSON, constants.CONTENT_TYPE_APPLICATION_JSON);
      logger.debug(`${LOGGER_TAG_ID} Proxying request to ${apiURL}`);
      let httpOptions = createRequestOption(req.method, apiURL, req.body, headers);
      let axiosResponse = await axios(httpOptions);
      delete axiosResponse.headers[constants.TRANSFER_ENCODING];
      response = axiosResponse.data;
      res.set(axiosResponse.headers);
      // Include the session-token-bkd in the response headers
      if (sessionData.backboneSession && req.url === API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH) {
        logger.info(`${LOGGER_TAG_ID} Setting session token in response headers`);
        res.set(constants.SESSION_TOKEN_BKD, sessionData.backboneSession);
      }
    } catch (error) {
      if (error.response != null) {
        logger.error(`${LOGGER_TAG_ID} Error in proxying request: ${error.message}`);
        response = error.response.data;
        res.status(error.response.status);
      } else if (error.errors != null) {
        logger.error(`${LOGGER_TAG_ID} Validation error: ${error.errors}`);
        response = error;
        res.status(constants.HTTP_STATUS_CODE_500_SERVER_ERROR);
      }
    }
    logger.info(`${LOGGER_TAG_ID} Response status: ${res.statusCode}`);
    res.send(response);
  } else {
    logger.error(`${LOGGER_TAG_ID} Invalid API URL: ${apiURL}`);
    res.send(constants.API_INVALID_URL_REQUEST_TITLE);
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
  const contentType = req.header(constants.CONTENT_TYPE);

  logger.debug(`${LOGGER_TAG_ID} Content-Type: ${contentType}`);
  if (req.url === constants.INNER_VERIFY_CODE_PATH && req.method === constants.POST_METHOD) {
    logger.debug(`${LOGGER_TAG_ID} Encrypting password for verify code request`);
    req.body[constants.PASSWORD_ATTRIBUTE] = CryptoJS.AES.encrypt(req.body.password, cKey, {iv: iv}).toString();
  }
  if (contentType !== null && contentType === constants.CONTENT_TYPE_APPLICATION_JSON) {
    logger.debug(`${LOGGER_TAG_ID} Setting Content-Type to application/json`);
    headers[constants.CONTENT_TYPE] = constants.CONTENT_TYPE_APPLICATION_JSON;
  } else {
    logger.debug(`${LOGGER_TAG_ID} Setting Content-Type to default: ${defaultContentType}`);
    headers[constants.CONTENT_TYPE] = defaultContentType;
  }
  logger.debug(`${LOGGER_TAG_ID} Headers: ${JSON.stringify(headers)}`);
  return headers;
};

module.exports = {
  registerProxyApi
};
