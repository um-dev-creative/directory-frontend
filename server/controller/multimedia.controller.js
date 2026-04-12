const axios = require('axios');
const FormData = require('form-data');
const appConfig = require("../config/app.config");
const constants = require("../config/constants.util");
const {getApiEndpoint, getSimpleResponse} = require('../shared/common-function');
const directoryUserProfileImageProxyConfig = appConfig.getDirectoryUserProfileImageProxyConfig();
const directoryBusinessImageProxyConfig = require('../config/config.json').directoryBackendBusinessImageProxyConfig;
const LOGGER_TAG_ID = `[${constants.LOGGER_TAG_DIRECTORY_BACKEND_MULTIMEDIA}] :::`;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const logger = appConfig.getLoggerApp();
const {
  API_SERVICE_DIRECTORY_MAP
} = require("../shared/oauth-common-function");
const oauthCommonFunction = require("../shared/oauth-common-function");
const {decode} = require("jsonwebtoken");


/**
 * Directory OAuth client configuration.
 * @type {{password: string, clientId: string, tokenUrl: string, clientSecret: string, authenticationType: string, grantType: string, username: string}}
 */
const directoryOauthClientConfig = {
  clientId: oauthCommonFunction.OAUTH_CLIENT_ID,
  clientSecret: oauthCommonFunction.OAUTH_CLIENT_SECRET,
  grantType: oauthCommonFunction.OAUTH_GRANT_TYPE,
  tokenUrl: oauthCommonFunction.OAUTH_TOKEN_URL,
  authenticationType: oauthCommonFunction.OAUTH_AUTHENTICATION_TYPE,
  username: oauthCommonFunction.OAUTH_USER_ALIAS,
  password: oauthCommonFunction.OAUTH_USER_PASSWORD
};

/**
 * Handles uploading of a user's profile image to an external API.
 *
 * This function validates the provided session token and checks for the presence of
 * a file in the request. If validation passes, it prepares the file as form-data
 * and forwards it to the configured external API. The response from the external API
 * is relayed back to the client.
 *
 * Errors are logged and appropriate HTTP status codes are returned in case of
 * unauthorized access, missing file, or other failures during the process.
 *
 * @param {Object} req - The request object containing headers, body, and file data.
 * @param {Object} res - The response object for sending the API response back to the client.
 */
const uploadProfileImage = async (req, res) => {
  let response = null;
  if (!req.file) {
    logger.error(`${LOGGER_TAG_ID} No file provided in the request`);
    return res.status(400).json({error: 'No file provided'});
  }
  const userId = decode(req.headers[constants.SESSION_TOKEN_DIR])?.uid;

  try {
    const directorySessionData = await oauthCommonFunction.getDirectorySessionToken(userId, directoryOauthClientConfig);
    const apiURL = getApiEndpoint(req.url, directoryUserProfileImageProxyConfig, API_SERVICE_DIRECTORY_MAP);
    logger.debug(`${LOGGER_TAG_ID} API URL: ${apiURL}`);

    // Prepare form-data for external API
    const formData = new FormData();
    formData.append(req.file.fieldname, req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const headers = {
      [constants.SESSION_TOKEN_DIR]: req.headers[constants.SESSION_TOKEN_DIR],
      [constants.AUTHORIZATION]: constants.BEARER.concat(directorySessionData.directoryBearerToken),
      ...formData.getHeaders(),
    };

    logger.debug(`${LOGGER_TAG_ID} Headers:`, headers);
    const axiosResponse = await axios.post(apiURL, formData, {headers: headers});
    logger.info(`${LOGGER_TAG_ID} File uploaded successfully: ${axiosResponse.status}`);
    response = getSimpleResponse(axiosResponse, null);
    res.status(axiosResponse.status).json(response.data);
  } catch (error) {
    logger.error(`${LOGGER_TAG_ID} Error during file upload: ${error.message}`);
    res.status(error.response?.status || 500).json({error: error.message});
  }
};

/**
 * Handles uploading of a business profile image to the downstream API.
 *
 * Validates the businessId as a UUID to prevent path injection, then proxies
 * the multipart file to /directory-backend/api/v1/businesses/images/{businessId}
 * using directory OAuth credentials. The URL is resolved via the proxy config
 * allowlist (SSRF-safe).
 *
 * @param {Object} req - Request with params.businessId, headers, and file.
 * @param {Object} res - Response object.
 */
const uploadBusinessImage = async (req, res) => {
  if (!req.file) {
    logger.error(`${LOGGER_TAG_ID} No file provided in the request`);
    return res.status(400).json({ error: 'No file provided' });
  }

  const { businessId } = req.params;
  if (!businessId || !UUID_REGEX.test(businessId)) {
    logger.error(`${LOGGER_TAG_ID} Invalid businessId format`);
    return res.status(400).json({ error: 'Invalid businessId' });
  }

  const userId = decode(req.headers[constants.SESSION_TOKEN_DIR])?.uid;

  try {
    const directorySessionData = await oauthCommonFunction.getDirectorySessionToken(userId, directoryOauthClientConfig);

    const apiURL = getApiEndpoint(req.url, directoryBusinessImageProxyConfig, API_SERVICE_DIRECTORY_MAP);
    logger.debug(`${LOGGER_TAG_ID} Business image API URL: ${apiURL}`);

    const formData = new FormData();
    formData.append(req.file.fieldname, req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const headers = {
      [constants.SESSION_TOKEN_DIR]: req.headers[constants.SESSION_TOKEN_DIR],
      [constants.AUTHORIZATION]: constants.BEARER.concat(directorySessionData.directoryBearerToken),
      ...formData.getHeaders(),
    };

    const axiosResponse = await axios.post(apiURL, formData, { headers });
    logger.info(`${LOGGER_TAG_ID} Business image uploaded successfully: ${axiosResponse.status}`);
    const response = getSimpleResponse(axiosResponse, null);
    res.status(axiosResponse.status).json(response.data);
  } catch (error) {
    logger.error(`${LOGGER_TAG_ID} Error during business image upload: ${error.message}`);
    res.status(error.response?.status || 500).json({ error: 'Business image upload failed' });
  }
};

module.exports = {
  uploadProfileImage,
  uploadBusinessImage
};
