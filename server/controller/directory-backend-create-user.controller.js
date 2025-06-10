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
  getRegex, getApiEndpoint, createRequestOption, getStandardHeader
} = require("../shared/common-function");

const schemesList = ["http:", "https:"];
const domainsList = ["prx-qa.backbone.tst", "prx-qa.manager.tst", "localhost"];
const {backboneSessionToken} = require("./backbone.controller");

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
  INNER_CREATE_USER_PATH, DS_CREATE_USER_PATH
} = require("../config/constants.util");
const {
  API_SERVICE_DIRECTORY_MAP, getDirectorySessionToken
} = require("../shared/oauth-common-function");

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
      // Get the backbone session token (already cached in backbone.controller.js)
      const backboneSessionData = await backboneSessionToken(req);
      // Get and reuse session and application tokens for Directory Backend
      const headers = getRequestHeader(req,  backboneSessionData.backboneBearerToken, constants.ACCEPT, constants.CONTENT_TYPE_DEFAULT);
      logger.info(`[DIS] Proxying request to ${apiURL}`);
      let httpOptions;
      if (apiURL.indexOf(DS_CREATE_USER_PATH) > 0) {
        httpOptions = createRequestOption(req.method, apiURL, req.body, headers);
      } else {
        throw new Error('Invalid API URL for proxying');
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
 * @param authBearerToken - The token for the backend services.
 * @param {string} defaultAccept - The default Accept header value.
 * @param {string} defaultContentType - The default Content-Type header value.
 * @returns {Object} - The constructed headers.
 */
const getRequestHeader = function (req, authBearerToken, defaultAccept, defaultContentType) {
  let headers = getStandardHeader(req, authBearerToken, defaultAccept);
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
