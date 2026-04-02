const axios = require('axios');
const {getApiEndpoint, getSimpleResponse} = require('../shared/common-function');
const appConfig = require('../config/app.config');
const directoryVerifyCodeProxyConfig = appConfig.getDirectoryProxyConfig();
const {backboneRenewToken} = require("./backbone.controller");
const constants = require("../config/constants.util");
const logger = appConfig.getLoggerApp();
const LOGGER_TAG_ID = `[${constants.LOGGER_TAG_DIRECTORY_BACKEND_STANDARD}] :::`;
const {
  API_SERVICE_DIRECTORY_MAP
} = require("../shared/oauth-common-function");

/**
 * Middleware function to handle API proxying for directory backend services.
 * This function forwards incoming requests to a specific API endpoint based on
 * the request's URL and configured directory proxy settings. It also manages
 * request headers, including session tokens and authorization headers, and handles
 * responses and errors appropriately.
 *
 * @param {Object} req - The incoming HTTP request object.
 * @param {Object} res - The outgoing HTTP response object.
 * @throws {Object} If an error occurs during the API request, the function sends
 * a response with the appropriate status and error details.
 */
const proxyApi = async (req, res) => {
  let response = null;
  logger.info(`${LOGGER_TAG_ID} Proxying request to ${req.url}`);
  try {
    const apiURL = getApiEndpoint(req.url, directoryVerifyCodeProxyConfig, API_SERVICE_DIRECTORY_MAP);
    const sessionToken = req.headers[constants.SESSION_TOKEN_DIR] || '';
    const authHeader = req.headers[constants.AUTHORIZATION.toLowerCase()] || '';
    let httpOptions = createHttpOptions(req, authHeader, sessionToken, apiURL);

    logger.debug(`${LOGGER_TAG_ID} API URL: ${apiURL}`);
    logger.debug(`${LOGGER_TAG_ID} Headers: ${JSON.stringify(httpOptions.headers)}`);
    logger.debug(`${LOGGER_TAG_ID} Data: ${JSON.stringify(httpOptions.data)}`);
    const axiosResponse = await axios(httpOptions);
    logger.debug(`${LOGGER_TAG_ID} API response status: ${axiosResponse.status}`);
    if (httpOptions.url.endsWith(constants.DS_CREATE_BUSINESS) &&
      httpOptions.method === constants.POST_METHOD &&
      axiosResponse.status === constants.HTTP_STATUS_CODE_201_CREATED) {
      let newToken = await backboneRenewToken(req.body.userId);
      logger.debug(`${LOGGER_TAG_ID} Directory Backend API call successful: ${req.method} ${apiURL}`);
      response = getSimpleResponse(axiosResponse, newToken);
    } else {
      response = getSimpleResponse(axiosResponse, null);
    }
    logger.debug(`${LOGGER_TAG_ID} Response: ${JSON.stringify(response)}`);
    res.status(axiosResponse.status);
  } catch (error) {
    logger.error(`${LOGGER_TAG_ID} Error during API request: ${error.message}`);
    if (error.response != null) {
      logger.error(`${LOGGER_TAG_ID} API response error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      response = error.response.data;
      res.status(error.response.status);
    } else if (error.errors != null) {
      logger.error(`${LOGGER_TAG_ID} API errors: ${JSON.stringify(error.errors)}`);
      response = error;
      res.status(constants.HTTP_STATUS_CODE_500_SERVER_ERROR);
    }
  }
  logger.debug(`${LOGGER_TAG_ID} Sending response: ${JSON.stringify(response)}`);
  res.send(response);
};

/**
 * Constructs HTTP options for an API request based on the request method, headers, and data.
 *
 * @param {Object} req - The HTTP request object containing method and body properties.
 * @param {string} authHeader - The authorization header value for HTTP requests.
 * @param {string} sessionTokenHeader - The session token header value for HTTP requests.
 * @param {string} apiURL - The target API endpoint URL.
 * @returns {Object} The HTTP options object containing method, URL, headers, and optionally request data.
 */
const createHttpOptions = (req, authHeader, sessionTokenHeader, apiURL) => {
  let httpOptions;
  if (req.method === constants.POST_METHOD ||
    req.method === constants.PUT_METHOD ||
    req.method === constants.PATCH_METHOD && req.body) {
    httpOptions = {
      method: req.method,
      url: apiURL,
      headers: {
        [constants.AUTHORIZATION]: authHeader,
        [constants.SESSION_TOKEN_DIR]: sessionTokenHeader,
        [constants.CONTENT_TYPE]: constants.CONTENT_TYPE_APPLICATION_JSON,
        [constants.ACCEPT]: constants.CONTENT_TYPE_APPLICATION_JSON
      },
      data: req.body,
    };
  } else {
    httpOptions = {
      method: req.method,
      url: apiURL,
      headers: {
        [constants.AUTHORIZATION]: authHeader,
        [constants.SESSION_TOKEN_DIR]: sessionTokenHeader,
        [constants.CONTENT_TYPE]: constants.CONTENT_TYPE_APPLICATION_JSON,
        [constants.ACCEPT]: constants.CONTENT_TYPE_APPLICATION_JSON
      },
    };
  }
  return httpOptions;
};

module.exports = {
  proxyApi
};

