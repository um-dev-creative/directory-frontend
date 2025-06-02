const Agent = require('agentkeepalive');
const HttpsAgent = require('agentkeepalive').HttpsAgent;

const {ACCEPT, CONTENT_TYPE_DEFAULT, NOT_FOUND_REQUEST_CODE, NOT_FOUND_REQUEST_TITLE, NOT_FOUND_REQUEST_DETAIL,
  NOT_FOUND_REQUEST_CODE_VALUE, AUTHORIZATION, FID_USER_ID, FID_LOGGER_TRACKING_ID, BEARER, SESSION_TOKEN_BKD,
  SESSION_TOKEN_DIR, BEARER_TOKEN_REGEX
} = require("../config/constants.util");
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
    return jwtPayload.alias;
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
    responseType: headers[ACCEPT] === CONTENT_TYPE_DEFAULT ? 'blob' : 'json'
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

    throw createErrorResponse(NOT_FOUND_REQUEST_CODE,
      NOT_FOUND_REQUEST_TITLE,
      NOT_FOUND_REQUEST_DETAIL,
      NOT_FOUND_REQUEST_CODE_VALUE);
  }
};

function isValidBearerToken(token) {
  return BEARER_TOKEN_REGEX.test(token);
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


/**
 * Constructs the basic headers for the proxied request.
 * @param req - The request object.
 * @param bearerToken - The token for the directory services.
 * @param backboneSession - The session token for the backbone services.
 * @param defaultAccept - The default Accept header value.
 * @returns {{}} - The constructed headers.
 */
const getAuthBasicHeader = function (req, bearerToken, backboneSession, defaultAccept) {
  let headers = {};
  const fidLoggerTrackingId = req.header(FID_LOGGER_TRACKING_ID);
  const userId = req.header(FID_USER_ID);
  const sessionTokenBkd = req.header(SESSION_TOKEN_BKD);
  const accept = req.header(ACCEPT);
  const sessionToken = req.header(SESSION_TOKEN_DIR);
  if (fidLoggerTrackingId !== null && isValidUUID(fidLoggerTrackingId)) {
    headers[FID_LOGGER_TRACKING_ID] = fidLoggerTrackingId;
  } else {
    headers[FID_LOGGER_TRACKING_ID] = uuidv4();
  }

  if (userId !== null && isValidUUID(userId)) {
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

  if (sessionTokenBkd !== null && isValidBearerToken(sessionTokenBkd)) {
    headers[SESSION_TOKEN_BKD] = sessionTokenBkd;
  }

  if (backboneSession) {
    headers[SESSION_TOKEN_BKD] = backboneSession;
  }

  if (sessionToken) {
    headers[SESSION_TOKEN_DIR] = sessionToken;
  }

  return headers;
};

/**
 * Constructs the standard headers for the proxied request.
 * @param req - The request object.
 * @param bearerToken - The token for the directory services.
 * @param sessionToken - The session token for the directory services.
 * @param backboneSession - The session token for the backbone services.
 * @param defaultAccept - The default Accept header value.
 * @returns {{}} - The constructed headers.
 */
const getStandardHeader = function (req, bearerToken, sessionToken, backboneSession, defaultAccept) {
  // getAuthBasicHeader: (req, bearerToken, backboneSession, defaultAccept)
  const headers = getAuthBasicHeader(req, bearerToken, backboneSession, defaultAccept);
  if (sessionToken) {
    headers[SESSION_TOKEN_DIR] = sessionToken;
  }
  return headers;
};

module.exports = {decodeJwtToken, createRequestOption, isValidUUID, getRegex, getApiEndpoint, isValidBearerToken, getBasicHeader, getAuthBasicHeader, getStandardHeader};
