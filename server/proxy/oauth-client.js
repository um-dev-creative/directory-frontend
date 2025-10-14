const assert = require('assert');
const axios = require('axios');
const appConfig = require("../config/app.config");
const logger = appConfig.getLoggerApp();
const constants = require('../config/constants.util.js');
const { getRedisClient, isRedisReady } = require('../shared/redis-session-store');
const { withLock } = require('../shared/redis-lock');

const LOGGER_TAG_ID = `[${constants.LOGGER_TAG_OAUTH_CLIENT}] :::`;
const TOKEN_CACHE_PREFIX = 'oauth_token:';

const AuthenticationType = {
  OPAQUE: "OPAQUE",
  JWT: "JWT"
}

/**
 * Class representing an OAuth client.
 */
class OAuthClient {
  clientId;
  clientSecret;
  grantType;
  tokenUrl;
  authenticationType;
  tokenCachePeriod = 1800;
  cacheToken;
  lastRequestTime = 0;

  /**
   * Creates an OAuth client.
   * @param {Object} config - The configuration object.
   * @param {string} config.clientId - The client ID.
   * @param {string} config.clientSecret - The client secret.
   * @param {string} config.grantType - The grant type.
   * @param {string} config.tokenUrl - The token URL.
   * @param {string} config.authenticationType - The authentication type.
   * @param {string} config.username - The username.
   * @param {string} config.password - The password.
   */
  constructor(config) {
    assert.ok(config, `${LOGGER_TAG_ID} config is not defined`);
    assert.ok(config.clientId, `${LOGGER_TAG_ID} config.clientId is not provided for Auth Type: ${config.clientId}`);
    assert.ok(config.clientSecret, `${LOGGER_TAG_ID} config.clientSecret is not provided for Auth Type: ${config.clientSecret}`);
    assert.ok(config.grantType, `${LOGGER_TAG_ID} config.grantType is not provided for Auth Type: ${config.grantType}`);
    assert.ok(config.tokenUrl, `${LOGGER_TAG_ID} config.tokenUrl is not provided for Auth Type: ${config.tokenUrl}`);
    assert.ok(config.username, `${LOGGER_TAG_ID} config.username is not provided for Auth Type: ${config.username}`);
    assert.ok(config.password, `${LOGGER_TAG_ID} config.password is not provided for Auth Type: ${config.password}`);

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.grantType = config.grantType;
    this.tokenUrl = config.tokenUrl;
    this.username = config.username;
    this.password = config.password;
    this.authenticationType = config.authenticationType;
  }

  /**
   * Retrieves the bearer token.
   * @returns {Promise<string>} The bearer token.
   */
  getBearerToken = async () => {
    logger.debug(`${LOGGER_TAG_ID} getBearerToken called with clientId:
    ${this.clientId}, authenticationType: ${this.authenticationType}, grantType: ${this.grantType}`);
    
    const cacheKey = `${TOKEN_CACHE_PREFIX}${this.clientId}`;
    const lockKey = `lock:${cacheKey}`;
    const redisClient = getRedisClient();

    // Try to get token from Redis first if available
    if (isRedisReady() && redisClient) {
      try {
        const cachedToken = await redisClient.get(cacheKey);
        if (cachedToken) {
          logger.debug(`${LOGGER_TAG_ID} Returning cached token from Redis`);
          return cachedToken;
        }
      } catch (error) {
        logger.error(`${LOGGER_TAG_ID} Error retrieving token from Redis: ${error.message}`);
      }
    }

    // Check in-memory cache as fallback
    const requestTime = new Date().getTime();
    if (this.cacheToken && (requestTime - this.lastRequestTime) / 1000 <= this.tokenCachePeriod) {
      logger.debug(`${LOGGER_TAG_ID} Returning cached token from memory`);
      return this.cacheToken;
    }

    // Need to fetch new token - use distributed lock if Redis is available
    const fetchToken = async () => {
      // Double-check cache inside lock to avoid race condition
      if (isRedisReady() && redisClient) {
        try {
          const cachedToken = await redisClient.get(cacheKey);
          if (cachedToken) {
            logger.debug(`${LOGGER_TAG_ID} Token was cached by another request, returning it`);
            this.cacheToken = cachedToken;
            return cachedToken;
          }
        } catch (error) {
          logger.error(`${LOGGER_TAG_ID} Error checking cache in lock: ${error.message}`);
        }
      }

      // Check in-memory cache again
      const now = new Date().getTime();
      if (this.cacheToken && (now - this.lastRequestTime) / 1000 <= this.tokenCachePeriod) {
        logger.debug(`${LOGGER_TAG_ID} Token was cached in memory by another request, returning it`);
        return this.cacheToken;
      }

      logger.debug(`${LOGGER_TAG_ID} Cache token is either undefined or expired. Requesting new token.`);
      let options = {};
      if (this.authenticationType === AuthenticationType.OPAQUE) {
        logger.debug(`${LOGGER_TAG_ID} Using OPAQUE authentication type`);
        options = {
          headers: {
            'Content-Type': constants.CONTENT_TYPE_X_FORM_URLENCODED,
          },
          data: new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: this.grantType,
            username: this.username,
            password: this.password
          }),
          url: this.tokenUrl
        };
      } else {
        logger.debug(`${LOGGER_TAG_ID} Using JWT authentication type`);
        options = {
          method: constants.POST_METHOD,
          headers: {
            'Content-Type': constants.CONTENT_TYPE_X_FORM_URLENCODED,
          },
          data: {
            grant_type: this.grantType,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            username: this.username,
            password: this.password
          },
          url: this.tokenUrl
        };
        logger.debug(`${LOGGER_TAG_ID} Using JWT authentication type with data: ${JSON.stringify(options.data)}`);
      }
      
      logger.debug(`${LOGGER_TAG_ID} Requesting token from ${this.tokenUrl} with clientId: ${this.clientId},
       authenticationType: ${this.authenticationType} and grantType: ${this.grantType}`);
      // Call OAuth service
      logger.debug(`${LOGGER_TAG_ID} Request options: ${JSON.stringify(options)}`);
      const oauthResponse = await axios(options);
      logger.debug(`${LOGGER_TAG_ID} Received token response from OAuth server`);
      
      const accessToken = oauthResponse.data.access_token;
      const expiresIn = oauthResponse.data.expires_in || this.tokenCachePeriod;
      
      // Cache token in Redis with TTL if available
      if (isRedisReady() && redisClient) {
        try {
          // Use expires_in from response for TTL, with a small buffer (subtract 10 seconds)
          const ttlSeconds = Math.max(expiresIn - 10, 60);
          await redisClient.setEx(cacheKey, ttlSeconds, accessToken);
          logger.debug(`${LOGGER_TAG_ID} Token cached in Redis with TTL: ${ttlSeconds}s`);
        } catch (error) {
          logger.error(`${LOGGER_TAG_ID} Error caching token in Redis: ${error.message}`);
        }
      }
      
      // Also cache in memory as fallback
      this.cacheToken = accessToken;
      this.lastRequestTime = now;
      
      return accessToken;
    };

    // Execute with distributed lock if Redis is available
    if (isRedisReady() && redisClient) {
      logger.debug(`${LOGGER_TAG_ID} Fetching token with distributed lock`);
      return await withLock(redisClient, lockKey, fetchToken, 15000);
    } else {
      logger.debug(`${LOGGER_TAG_ID} Fetching token without distributed lock (Redis not available)`);
      return await fetchToken();
    }
  };
}

/**
 * Retrieves an OAuth client instance.
 * @param {Object} oauthClientConfig - The OAuth client configuration.
 * @returns {OAuthClient} The OAuth client instance.
 */
module.exports.getOAuthClient = function (oauthClientConfig) {
  return new OAuthClient(oauthClientConfig);
}
