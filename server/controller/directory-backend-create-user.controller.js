const Ajv = require('ajv');
const CryptoJS = require("crypto-js");
const axios = require('axios');
const appConfig = require('../config/app.config');
const constants = require('../config/constants.util.js');
const directoryCreateUserProxyConfig = appConfig.getDirectoryCreateUserProxyConfig();
const oauthCommonFunction = require("../shared/oauth-common-function");
const logger = appConfig.getLoggerApp();
const cKey = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_IV);
const LOGGER_TAG_ID = `[${constants.LOGGER_TAG_DIRECTORY_BACKEND_CREATE_USER}] :::`;

const commonFunction = require("../shared/common-function");

const schemesList = ["http:", "https:"];
const domainsList = ["directory-backend", "backbone-rest", "prx-qa.backbone.tst", "prx-qa.manager.tst", "localhost"];
const {backboneSessionToken} = require("./backbone.controller");

const ajv = new Ajv();
ajv.addFormat('uuid', commonFunction.getRegex())
ajv.addSchema({type: 'string', format: 'uuid'}, 'schema');

/**
 * Proxies API requests to the appropriate backend services.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const proxyApi = async (req, res) => {
  let response = null;
  const apiURL = commonFunction.getApiEndpoint(req.url, directoryCreateUserProxyConfig, oauthCommonFunction.API_SERVICE_DIRECTORY_MAP);
  const validationSchema = schemesList.includes(new URL(apiURL).protocol) && domainsList.includes(new URL(apiURL).hostname);

  if (validationSchema) {
    try {
      // Get the backbone session token (already cached in backbone.controller.js)
      const backboneSessionData = await backboneSessionToken(req);
      // Get and reuse session and application tokens for Directory Backend
      const headers = getRequestHeader(req, backboneSessionData.backboneBearerToken, constants.ACCEPT, constants.CONTENT_TYPE_DEFAULT);
      logger.info(`${LOGGER_TAG_ID} Proxying request to ${apiURL}`);
      let httpOptions;
      if (apiURL.indexOf(constants.DS_CREATE_USER_PATH) > 0) {
        httpOptions = commonFunction.createRequestOption(req.method, apiURL, req.body, headers);
      } else {
        throw new Error('Invalid API URL for proxying');
      }

      let axiosResponse = await axios(httpOptions);
      delete axiosResponse.headers[constants.TRANSFER_ENCODING];
      response = axiosResponse.data;
      res.set(axiosResponse.headers);

      // Include the session-token-bkd in the response headers
      if (backboneSessionData && req.url === constants.INNER_AUTH_PATH) {
        res.set(constants.SESSION_TOKEN_BKD, backboneSessionData.backboneSession);
      }
    } catch (error) {
      if (error.response != null) {
        response = error.response.data;
        res.status(error.response.status);
      } else if (error.errors != null) {
        response = error;
        res.status(constants.HTTP_STATUS_CODE_500_SERVER_ERROR);
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
 * @param authBearerToken - The token for the backend services.
 * @param {string} defaultAccept - The default Accept header value.
 * @param {string} defaultContentType - The default Content-Type header value.
 * @returns {Object} - The constructed headers.
 */
const getRequestHeader = function (req, authBearerToken, defaultAccept, defaultContentType) {
  let headers = commonFunction.getStandardHeader(req, authBearerToken, defaultAccept);
  const contentType = req.header(constants.CONTENT_TYPE);
  if (req.url === constants.INNER_AUTH_PATH ||
    req.url === constants.INNER_CREATE_USER_PATH &&
    req.method === constants.POST_METHOD) {
    req.body[constants.PASSWORD_ATTRIBUTE] = CryptoJS.AES.encrypt(req.body.password, cKey, {iv: iv}).toString();
  }
  if (contentType !== null && contentType === constants.CONTENT_TYPE_DEFAULT) {
    headers[constants.CONTENT_TYPE] = constants.CONTENT_TYPE_DEFAULT;
  } else {
    headers[constants.CONTENT_TYPE] = defaultContentType;
  }
  return headers;
};

module.exports = {
  proxyApi
};
