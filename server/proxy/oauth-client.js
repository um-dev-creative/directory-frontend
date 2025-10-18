const assert = require('assert');
const axios = require('axios');
const appConfig = require("../config/app.config");
const logger = appConfig.getLoggerApp();
const constants = require('../config/constants.util.js');
const { getRedisClient } = require('../shared/redis-client');
const { acquireLock, releaseLock } = require('../shared/redis-lock');
const LOGGER_TAG_ID = `[${constants.LOGGER_TAG_OAUTH_CLIENT}] :::`;
const AuthenticationType = {
  OPAQUE: "OPAQUE",
  JWT: "JWT"
}

// In-memory fallback cache
const memoryCache = new Map();
const REDIS_TOKEN_PREFIX = 'oauth_token:';

/**
 * Class representing an OAuth client.
 */
class OAuthClient {
  clientId;
  clientSecret;
  grantType;
  tokenUrl;
  authenticationType;
  username;
  password;
  tokenCachePeriod = 1800;
  cacheToken;
  lastRequestTime = 0;
  redisClient = null;

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
    
    // Initialize Redis client asynchronously
    this.initRedis();
  }

  /**
   * Initialize Redis client
   */
  async initRedis() {
    try {
      this.redisClient = await getRedisClient();
    } catch (error) {
      logger.warn(`${LOGGER_TAG_ID} Redis not available, using memory cache: ${error.message}`);
    }
  }

  /**
   * Get cached token from Redis or memory
   * @returns {Promise<Object|null>}
   */
  async getCachedToken() {
    const cacheKey = REDIS_TOKEN_PREFIX + this.clientId;
    
    // Try Redis first
    if (this.redisClient && this.redisClient.isOpen) {
      try {
        const cachedData = await this.redisClient.get(cacheKey);
        if (cachedData) {
          const tokenData = JSON.parse(cachedData);
          logger.debug(`${LOGGER_TAG_ID} Token found in Redis cache`);
          return tokenData;
        }
      } catch (error) {
        logger.warn(`${LOGGER_TAG_ID} Error reading from Redis cache: ${error.message}`);
      }
    }
    
    // Fallback to memory cache
    const memoryCached = memoryCache.get(this.clientId);
    if (memoryCached) {
      logger.debug(`${LOGGER_TAG_ID} Token found in memory cache`);
      return memoryCached;
    }
    
    return null;
  }

  /**
   * Store token in Redis and memory
   * @param {string} token - Access token
   * @param {number} expiresIn - Expires in seconds
   */
  async setCachedToken(token, expiresIn) {
    const cacheKey = REDIS_TOKEN_PREFIX + this.clientId;
    const tokenData = {
      access_token: token,
      cached_at: Date.now(),
      expires_in: expiresIn || this.tokenCachePeriod
    };
    
    // Store in Redis with TTL
    if (this.redisClient && this.redisClient.isOpen) {
      try {
        const ttl = expiresIn || this.tokenCachePeriod;
        await this.redisClient.setEx(cacheKey, ttl, JSON.stringify(tokenData));
        logger.debug(`${LOGGER_TAG_ID} Token cached in Redis with TTL: ${ttl}s`);
      } catch (error) {
        logger.warn(`${LOGGER_TAG_ID} Error caching token in Redis: ${error.message}`);
      }
    }
    
    // Also store in memory as fallback
    memoryCache.set(this.clientId, tokenData);
    logger.debug(`${LOGGER_TAG_ID} Token cached in memory`);
  }

  /**
   * Check if cached token is still valid
   * @param {Object} tokenData
   * @returns {boolean}
   */
  isTokenValid(tokenData) {
    if (!tokenData || !tokenData.access_token) {
      return false;
    }
    
    const now = Date.now();
    const cachedAt = tokenData.cached_at || 0;
    const expiresIn = tokenData.expires_in || this.tokenCachePeriod;
    const elapsedSeconds = (now - cachedAt) / 1000;
    
    // Consider token valid if less than 90% of TTL has elapsed
    return elapsedSeconds < (expiresIn * 0.9);
  }

  /**
   * Retrieves the bearer token.
   * @returns {Promise<string>} The bearer token.
   */
  getBearerToken = async () => {
    logger.debug(`${LOGGER_TAG_ID} getBearerToken called with clientId: [REDACTED], authenticationType: ${this.authenticationType}, grantType: ${this.grantType}`);
    
    // Check cache first
    const cachedToken = await this.getCachedToken();
    if (cachedToken && this.isTokenValid(cachedToken)) {
      logger.debug(`${LOGGER_TAG_ID} Returning cached token`);
      return cachedToken.access_token;
    }
    
    // Need to fetch new token - use distributed lock to prevent concurrent requests
    const lockKey = `lock:oauth_token:${this.clientId}`;
    let lockToken = null;
    
    try {
      // Try to acquire lock
      if (this.redisClient && this.redisClient.isOpen) {
        lockToken = await acquireLock(this.redisClient, lockKey, 5000);
        
        if (!lockToken) {
          // Another process is fetching the token, wait and check cache again
          logger.debug(`${LOGGER_TAG_ID} Waiting for token fetch by another process...`);
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const retryCache = await this.getCachedToken();
          if (retryCache && this.isTokenValid(retryCache)) {
            logger.debug(`${LOGGER_TAG_ID} Token fetched by another process, using cached`);
            return retryCache.access_token;
          }
          // If still no token, proceed without lock (fallback)
          logger.debug(`${LOGGER_TAG_ID} Proceeding without lock (fallback)`);
        }
      }
      
      // Fetch new token
      logger.debug(`${LOGGER_TAG_ID} Cache token expired or not found. Requesting new token.`);
      let options = {};
      
      if (this.authenticationType === AuthenticationType.OPAQUE) {
        logger.debug(`${LOGGER_TAG_ID} Using OPAQUE authentication type`);
        const formData = new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: this.grantType,
          username: this.username,
          password: this.password
        });
        
        options = {
          method: constants.POST_METHOD,
          url: this.tokenUrl,
          headers: {
            'Content-Type': constants.CONTENT_TYPE_X_FORM_URLENCODED,
          },
          data: formData.toString()
        };
      } else {
        logger.debug(`${LOGGER_TAG_ID} Using JWT authentication type`);
        const formData = new URLSearchParams({
          grant_type: this.grantType,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          username: this.username,
          password: this.password
        });
        
        options = {
          method: constants.POST_METHOD,
          url: this.tokenUrl,
          headers: {
            'Content-Type': constants.CONTENT_TYPE_X_FORM_URLENCODED,
          },
          data: formData.toString()
        };
      }
      
      logger.debug(`${LOGGER_TAG_ID} Requesting token from ${this.tokenUrl}`);
      
      // Call OAuth service
      const oauthResponse = await axios(options);
      logger.debug(`${LOGGER_TAG_ID} Received token response`);
      
      const accessToken = oauthResponse.data.access_token;
      const expiresIn = oauthResponse.data.expires_in;
      
      // Cache the token
      await this.setCachedToken(accessToken, expiresIn);
      
      return accessToken;
    } catch (error) {
      logger.error(`${LOGGER_TAG_ID} Error fetching token: ${error.message}`);
      throw error;
    } finally {
      // Release lock if acquired
      if (lockToken && this.redisClient && this.redisClient.isOpen) {
        await releaseLock(this.redisClient, lockKey, lockToken);
      }
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
