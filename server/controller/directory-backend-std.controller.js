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
  try {
    const apiURL = getApiEndpoint(req.url, directoryVerifyCodeProxyConfig, API_SERVICE_DIRECTORY_MAP);
    const sessionToken = req.headers[constants.SESSION_TOKEN_DIR] || '';
    const authHeader = req.headers[constants.AUTHORIZATION] || '';
    let httpOptions = createHttpOptions(req, authHeader, sessionToken, apiURL);

    const axiosResponse = await axios(httpOptions);

    if (httpOptions.url.endsWith(constants.DS_CREATE_BUSINESS) &&
      httpOptions.method === constants.POST_METHOD &&
      axiosResponse.status === constants.HTTP_STATUS_CODE_201_CREATED) {
      let newToken = await backboneRenewToken(req.body.userId);
      logger.info(`${LOGGER_TAG_ID} Directory Backend API call successful: ${req.method} ${apiURL}`);
      response = getSimpleResponse(axiosResponse, newToken);
    } else {
      response = getSimpleResponse(axiosResponse, null);
    }
    res.status(axiosResponse.status);
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
        'Authorization': authHeader,
        'session-token': sessionTokenHeader,
        'Content-Type': constants.CONTENT_TYPE_DEFAULT,
        'Accept': constants.CONTENT_TYPE_DEFAULT
      },
      data: req.body,
    };
  } else {
    httpOptions = {
      method: req.method,
      url: apiURL,
      headers: {
        'Authorization': authHeader,
        'session-token': sessionTokenHeader,
        'Content-Type': constants.CONTENT_TYPE_DEFAULT,
        'Accept': constants.CONTENT_TYPE_DEFAULT
      },
    };
  }
  return httpOptions;
};

module.exports = {
  proxyApi
};

