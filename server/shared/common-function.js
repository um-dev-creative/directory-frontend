const Agent = require('agentkeepalive');
const HttpsAgent = require('agentkeepalive').HttpsAgent;
const constants = require('../config/constants.util.js');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const {createErrorResponse} = require("./error-util");
const {v4: uuidv4} = require('uuid');

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
 * Keepalive agent for HTTP connections.
 * @type {AgentKeepAlive} keepaliveAgent - The keepalive agent.
 */
const keepaliveAgent = new Agent(httpConnectionOptions);

/**
 * Keepalive agent for HTTPS connections.
 * @type {keepaliveHttpsAgent.HttpsAgent} keepaliveHttpsAgent
 */
const keepaliveHttpsAgent = new HttpsAgent(httpConnectionOptions);

/**
 * Proxies the request to the directory backend.
 *
 * @param jwtSession
 * @returns {undefined|*}
 */
function decodeJwtToken(jwtSession) {
  if (jwtSession) {
    let base64Url = jwtSession.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    let jwtPayload = JSON.parse(jsonPayload);
    return jwtPayload?.alias || jwtPayload?.sub;
  }
  return undefined;
}

/**
 * Creates the request options for the proxied request.
 *
 * @param {string} method - The HTTP method.
 * @param {string} url - The request URL.
 * @param {Object} body - The request body.
 * @param {Object} headers - The request headers.
 * @returns {Object} - The constructed request options.
 */
let createRequestOption = function (method, url, body, headers) {
  return {
    method: method.toLowerCase(),
    url: url,
    data: body != null ? body : null,
    headers: headers,
    httpAgent: keepaliveAgent,
    httpsAgent: keepaliveHttpsAgent,
    responseType: headers[constants.ACCEPT] === constants.CONTENT_TYPE_APPLICATION_JSON ? 'json' : 'blob'
  }
};

/**
 * Retrieves the backbone client instance, initializing it if necessary.
 *
 * @returns {Object} - The backbone client instance.
 */
function isValidUUID(uuid) {
  return uuidRegex.test(uuid);
}

let getRegex = function () {
  return uuidRegex;
};

/**
 * Retrieves the API endpoint for a given path.
 *
 * @param {string} path - The request path.
 * @param oAuthProxyConfig
 * @param API_SERVICE_MAP
 * @returns {string} - The full API endpoint URL.
 * @throws {Error} - Throws an error if the API endpoint is not found.
 */
let getApiEndpoint = function (path, oAuthProxyConfig, API_SERVICE_MAP) {
  let finalPath = null;
  let applicationName = null;
  for (const element of oAuthProxyConfig) {
    if (element.matchOn != null && element.matchOn.startWith != null && path.startsWith(element.matchOn.startWith)) {
      if (element.urlRewrite != null) {
        finalPath = path.replace(element.urlRewrite.from, element.urlRewrite.to);
      } else {
        finalPath = path;
      }
      applicationName = element.applicationName;
      break;
    }
  }
  let apiURL = API_SERVICE_MAP[applicationName];

  if (apiURL != null) {
    return apiURL + finalPath;
  } else {

    throw createErrorResponse(
      constants.HTTP_STATUS_CODE_404_NOT_FOUND,
      constants.NOT_FOUND_REQUEST_TITLE,
      constants.NOT_FOUND_REQUEST_DETAIL,
      constants.NOT_FOUND_REQUEST_CODE_VALUE);
  }
};

function isValidBearerToken(token) {
  return constants.BEARER_TOKEN_REGEX.test(token);
}

/**
 * Constructs the basic headers for the proxied request.
 * @param req - The request object.
 * @param bearerToken - The token for the directory services.
 * @param defaultAccept - The default Accept header value.
 * @returns {{}} - The constructed headers.
 */
const getBasicHeader = function (req, bearerToken, defaultAccept) {
  let headers = {};
  const fidLoggerTrackingId = req.header(constants.FID_LOGGER_TRACKING_ID);
  const userId = req.header(constants.FID_USER_ID);
  const accept = req.header(constants.ACCEPT);
  const uuidValid = isValidUUID(fidLoggerTrackingId);
  if (fidLoggerTrackingId !== null && uuidValid) {
    headers[constants.FID_LOGGER_TRACKING_ID] = fidLoggerTrackingId;
  } else {
    headers[constants.FID_LOGGER_TRACKING_ID] = uuidv4();
  }
  if (userId !== null && uuidValid) {
    headers[constants.FID_USER_ID] = fidLoggerTrackingId;
  } else {
    headers[constants.FID_USER_ID] = constants.FID_USER_ID_ANONYMOUS;
  }
  headers[constants.AUTHORIZATION] = constants.BEARER + bearerToken;

  if (accept && accept === constants.ACCEPT) {
    headers[constants.ACCEPT] = accept;
  } else {
    headers[constants.ACCEPT] = defaultAccept
  }

  return headers;
};

/**
 * Constructs the basic headers for the proxied request.
 * @param req - The request object.
 * @param sessionData - The session data containing directory and backbone tokens.
 * @param defaultAccept - The default Accept header value.
 * @returns {{}} - The constructed headers.
 */
const getAuthBasicHeader = function (req, sessionData, defaultAccept) {
  let headers = {};
  const fidLoggerTrackingId = req.header(constants.FID_LOGGER_TRACKING_ID);
  const userId = req.body['userId'] || req.header(constants.FID_USER_ID) || null;
  const accept = req.header(constants.ACCEPT);

  if (fidLoggerTrackingId !== null && isValidUUID(fidLoggerTrackingId)) {
    headers[constants.FID_LOGGER_TRACKING_ID] = fidLoggerTrackingId;
  } else {
    headers[constants.FID_LOGGER_TRACKING_ID] = uuidv4();
  }

  if (userId !== null && isValidUUID(userId)) {
    headers[constants.FID_USER_ID] = userId;
  } else {
    headers[constants.FID_USER_ID] = constants.FID_USER_ID_ANONYMOUS;
  }
  headers[constants.AUTHORIZATION] = constants.BEARER + sessionData.directoryBearerToken;

  if (accept && accept === constants.ACCEPT) {
    headers[constants.ACCEPT] = accept;
  } else {
    headers[constants.ACCEPT] = defaultAccept
  }

  if (sessionData.backboneSession) {
    headers[constants.SESSION_TOKEN_BKD] = sessionData.backboneSession;
  }

  if (sessionData.directorySession) {
    headers[constants.SESSION_TOKEN_DIR] = sessionData.directorySession;
  }

  return headers;
};

/**
 * Constructs the standard headers for the proxied request.
 * @param req - The request object.
 * @param bearerToken
 * @param backboneSessionToken - The session token for the directory services.
 * @param defaultAccept - The default Accept header value.
 * @returns {{}} - The constructed headers.
 */
const getStandardHeader = function (req, bearerToken, backboneSessionToken, defaultAccept) {
  return {
    [constants.AUTHORIZATION]: constants.BEARER + bearerToken,
    [constants.FID_LOGGER_TRACKING_ID]: uuidv4(),
    [constants.FID_USER_ID]: req.header(constants.FID_USER_ID) || constants.FID_USER_ID_ANONYMOUS,
    [constants.ACCEPT]: req.header(constants.ACCEPT) || defaultAccept,
    [constants.CONTENT_TYPE]: constants.CONTENT_TYPE_APPLICATION_JSON
  };
};

/**
 * Constructs a simplified response object based on the provided response and content parameters.
 *
 * @param {Object} res - The response object from which status and statusText are taken.
 * @param {*} content - Optional content to include in the data field of the response.
 * @returns {Object} A response object containing headers (statusText, status) and an optional data field.
 */
const simpleResponse = (res, content) => {
  if (res.data || content) {
    return (content === null) ?
      {
        headers: {
          statusText: res.statusText,
          status: res.status
        },
        data:  res.data
      } :
      {
        headers: {
          statusText: res.statusText,
          status: res.status
        },
        data: {
          token: content
        }
      };
  }
  return {
    headers: {
      statusText: res.statusText,
      status: res.status
    },
    data: null
  };
};

module.exports = {
  decodeJwtToken,
  createRequestOption,
  getRegex,
  getApiEndpoint,
  getBasicHeader,
  getAuthBasicHeader,
  getSimpleResponse: simpleResponse,
  getStandardHeader
};
