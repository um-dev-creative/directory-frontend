// server/shared/redis-session-store.js
// Redis-backed session store for user sessions with fallback to in-memory storage
const { createClient } = require('redis');
const appConfig = require('../config/app.config');
const logger = appConfig.getLoggerApp();

const LOGGER_TAG_ID = '[REDIS_SESSION_STORE] :::';
const SESSION_KEY_PREFIX = 'session:';

// In-memory fallback store
const memoryStore = new Map();

// Redis client instance
let redisClient = null;
let isRedisAvailable = false;

/**
 * Initialize Redis client
 * @returns {Promise<void>}
 */
async function initRedisClient() {
  if (redisClient) {
    return;
  }

  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    logger.info(`${LOGGER_TAG_ID} REDIS_URL not configured, using in-memory fallback`);
    isRedisAvailable = false;
    return;
  }

  try {
    logger.info(`${LOGGER_TAG_ID} Initializing Redis client with URL: ${redisUrl.replace(/\/\/[^@]*@/, '//***@')}`);
    
    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error(`${LOGGER_TAG_ID} Redis reconnection attempts exceeded, using in-memory fallback`);
            isRedisAvailable = false;
            return new Error('Redis reconnection attempts exceeded');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    redisClient.on('error', (err) => {
      logger.error(`${LOGGER_TAG_ID} Redis client error: ${err.message}`);
      isRedisAvailable = false;
    });

    redisClient.on('connect', () => {
      logger.info(`${LOGGER_TAG_ID} Redis client connected`);
    });

    redisClient.on('ready', () => {
      logger.info(`${LOGGER_TAG_ID} Redis client ready`);
      isRedisAvailable = true;
    });

    redisClient.on('reconnecting', () => {
      logger.info(`${LOGGER_TAG_ID} Redis client reconnecting`);
      isRedisAvailable = false;
    });

    await redisClient.connect();
    logger.info(`${LOGGER_TAG_ID} Redis client initialized successfully`);
  } catch (error) {
    logger.error(`${LOGGER_TAG_ID} Failed to initialize Redis client: ${error.message}`);
    isRedisAvailable = false;
    redisClient = null;
  }
}

/**
 * Get the session for a user if it exists and is not expired.
 * @param {string} userId - The user ID
 * @returns {Promise<SessionData|null>} Session data or null if not found/expired
 */
async function getUserSession(userId) {
  if (!userId) {
    return null;
  }

  const sessionKey = `${SESSION_KEY_PREFIX}${userId}`;

  // Try Redis first if available
  if (isRedisAvailable && redisClient?.isReady) {
    try {
      const sessionJson = await redisClient.get(sessionKey);
      if (sessionJson) {
        const session = JSON.parse(sessionJson);
        logger.debug(`${LOGGER_TAG_ID} Session retrieved from Redis for user: ${userId}`);
        
        // Check if session is expired
        const now = Date.now();
        const backboneExpired = session.backboneSessionExpiresAt && session.backboneSessionExpiresAt <= now;
        const directoryExpired = session.directorySessionExpiresAt && session.directorySessionExpiresAt <= now;
        
        if (backboneExpired || directoryExpired) {
          logger.debug(`${LOGGER_TAG_ID} Session expired for user: ${userId}`);
          await removeUserSession(userId);
          return null;
        }
        
        return session;
      }
      return null;
    } catch (error) {
      logger.error(`${LOGGER_TAG_ID} Error retrieving session from Redis: ${error.message}, falling back to memory`);
      isRedisAvailable = false;
    }
  }

  // Fallback to in-memory store
  logger.debug(`${LOGGER_TAG_ID} Using in-memory store for getUserSession: ${userId}`);
  const session = memoryStore.get(userId);
  if (session) {
    const now = Date.now();
    const backboneExpired = session.backboneSessionExpiresAt && session.backboneSessionExpiresAt <= now;
    const directoryExpired = session.directorySessionExpiresAt && session.directorySessionExpiresAt <= now;
    
    if (backboneExpired || directoryExpired) {
      logger.debug(`${LOGGER_TAG_ID} Session expired in memory for user: ${userId}`);
      memoryStore.delete(userId);
      return null;
    }
    
    return session;
  }
  
  return null;
}

/**
 * Set the session for a user.
 * @param {string} userId - The user ID
 * @param {string|null} alias - Optional alias
 * @param {SessionData} sessionData - Session data to store
 * @returns {Promise<void>}
 */
async function setUserSession(userId, alias, sessionData) {
  if (!userId && !alias) {
    throw new Error('User ID or alias must be provided to set a session.');
  }

  // Remove alias session if it exists (for user+alias case)
  if (userId && alias) {
    await removeUserSession(alias);
  }

  const key = userId || alias;
  const sessionKey = `${SESSION_KEY_PREFIX}${key}`;

  // Calculate TTL based on the earliest expiration
  let ttlSeconds = null;
  const now = Date.now();
  
  if (sessionData.backboneSessionExpiresAt) {
    const backboneTtl = Math.floor((sessionData.backboneSessionExpiresAt - now) / 1000);
    ttlSeconds = backboneTtl > 0 ? backboneTtl : null;
  }
  
  if (sessionData.directorySessionExpiresAt) {
    const directoryTtl = Math.floor((sessionData.directorySessionExpiresAt - now) / 1000);
    if (directoryTtl > 0 && (ttlSeconds === null || directoryTtl < ttlSeconds)) {
      ttlSeconds = directoryTtl;
    }
  }

  // Default to 1 hour if no expiration is set
  if (ttlSeconds === null || ttlSeconds <= 0) {
    ttlSeconds = 3600;
  }

  // Try Redis first if available
  if (isRedisAvailable && redisClient?.isReady) {
    try {
      const sessionJson = JSON.stringify(sessionData);
      await redisClient.setEx(sessionKey, ttlSeconds, sessionJson);
      logger.debug(`${LOGGER_TAG_ID} Session stored in Redis for user: ${key} with TTL: ${ttlSeconds}s`);
      return;
    } catch (error) {
      logger.error(`${LOGGER_TAG_ID} Error storing session in Redis: ${error.message}, falling back to memory`);
      isRedisAvailable = false;
    }
  }

  // Fallback to in-memory store
  logger.debug(`${LOGGER_TAG_ID} Using in-memory store for setUserSession: ${key}`);
  memoryStore.set(key, sessionData);
}

/**
 * Remove the session for a user.
 * @param {string} userId - The user ID
 * @returns {Promise<void>}
 */
async function removeUserSession(userId) {
  if (!userId) {
    return;
  }

  const sessionKey = `${SESSION_KEY_PREFIX}${userId}`;

  // Try Redis first if available
  if (isRedisAvailable && redisClient?.isReady) {
    try {
      await redisClient.del(sessionKey);
      logger.debug(`${LOGGER_TAG_ID} Session removed from Redis for user: ${userId}`);
      return;
    } catch (error) {
      logger.error(`${LOGGER_TAG_ID} Error removing session from Redis: ${error.message}, falling back to memory`);
      isRedisAvailable = false;
    }
  }

  // Fallback to in-memory store
  logger.debug(`${LOGGER_TAG_ID} Using in-memory store for removeUserSession: ${userId}`);
  memoryStore.delete(userId);
}

/**
 * Get Redis client instance (for use with redis-lock)
 * @returns {Object|null} Redis client or null if not available
 */
function getRedisClient() {
  return redisClient;
}

/**
 * Check if Redis is available
 * @returns {boolean} True if Redis is available
 */
function isRedisReady() {
  return isRedisAvailable && redisClient?.isReady;
}

// Initialize Redis on module load
initRedisClient().catch(err => {
  logger.error(`${LOGGER_TAG_ID} Failed to initialize Redis on module load: ${err.message}`);
});

module.exports = {
  getUserSession,
  setUserSession,
  removeUserSession,
  getRedisClient,
  isRedisReady,
  initRedisClient
};
