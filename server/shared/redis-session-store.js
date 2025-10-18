// server/shared/redis-session-store.js
// Redis-backed session store with TTL management
const appConfig = require('../config/app.config');
const logger = appConfig.getLoggerApp();

const LOGGER_TAG_ID = '[REDIS_SESSION_STORE] :::';
const SESSION_PREFIX = 'session:';

// Fallback in-memory store when Redis is unavailable
const memoryStore = new Map();

/**
 * Get the session for a user if it exists and is not expired.
 * @param {Object} redisClient - Redis client instance
 * @param {string} userId - User identifier
 * @returns {Promise<SessionData|null>}
 */
async function getUserSession(redisClient, userId) {
  if (!userId) {
    return null;
  }

  const key = SESSION_PREFIX + userId;

  // Try Redis first
  if (redisClient && redisClient.isOpen) {
    try {
      const sessionJson = await redisClient.get(key);
      if (sessionJson) {
        const session = JSON.parse(sessionJson);
        logger.debug(`${LOGGER_TAG_ID} Session found in Redis for user: ${userId}`);
        // Check if session is still valid
        if (session.backboneSessionExpiresAt > Date.now() && 
            (!session.directorySessionExpiresAt || session.directorySessionExpiresAt > Date.now())) {
          return session;
        }
        // Session expired, remove it
        await redisClient.del(key);
        logger.debug(`${LOGGER_TAG_ID} Expired session removed for user: ${userId}`);
        return null;
      }
    } catch (error) {
      logger.error(`${LOGGER_TAG_ID} Error getting session from Redis: ${error.message}`);
      // Fall through to memory store
    }
  }

  // Fallback to memory store
  const session = memoryStore.get(userId);
  if (session && session.backboneSessionExpiresAt > Date.now() && 
      (!session.directorySessionExpiresAt || session.directorySessionExpiresAt > Date.now())) {
    logger.debug(`${LOGGER_TAG_ID} Session found in memory for user: ${userId}`);
    return session;
  }

  return null;
}

/**
 * Set the session for a user with TTL based on expiration time.
 * @param {Object} redisClient - Redis client instance
 * @param {string} userId - User identifier
 * @param {string} alias - User alias (optional)
 * @param {SessionData} sessionData - Session data to store
 * @returns {Promise<void>}
 */
async function setUserSession(redisClient, userId, alias, sessionData) {
  if (!userId && !alias) {
    throw new Error('User ID or alias must be provided to set a session.');
  }

  // Determine TTL in seconds based on backboneSessionExpiresAt
  let ttlSeconds = 3600; // Default 1 hour
  if (sessionData.backboneSessionExpiresAt) {
    const ttlMs = sessionData.backboneSessionExpiresAt - Date.now();
    ttlSeconds = Math.max(60, Math.floor(ttlMs / 1000)); // Minimum 60 seconds
  }

  const sessionJson = JSON.stringify(sessionData);

  // Handle alias cleanup if both userId and alias provided
  if (userId && alias && userId !== alias) {
    const aliasKey = SESSION_PREFIX + alias;
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.del(aliasKey);
      } catch (error) {
        logger.error(`${LOGGER_TAG_ID} Error removing alias session from Redis: ${error.message}`);
      }
    }
    memoryStore.delete(alias);
  }

  // Store in Redis if available
  if (redisClient && redisClient.isOpen) {
    try {
      const key = SESSION_PREFIX + (userId || alias);
      await redisClient.setEx(key, ttlSeconds, sessionJson);
      logger.debug(`${LOGGER_TAG_ID} Session stored in Redis for: ${userId || alias} with TTL: ${ttlSeconds}s`);
      return;
    } catch (error) {
      logger.error(`${LOGGER_TAG_ID} Error storing session in Redis: ${error.message}, falling back to memory`);
      // Fall through to memory store
    }
  }

  // Fallback to memory store
  const key = userId || alias;
  memoryStore.set(key, sessionData);
  logger.debug(`${LOGGER_TAG_ID} Session stored in memory for: ${key}`);
}

/**
 * Remove the session for a user.
 * @param {Object} redisClient - Redis client instance
 * @param {string} userId - User identifier
 * @returns {Promise<void>}
 */
async function removeUserSession(redisClient, userId) {
  if (!userId) {
    return;
  }

  const key = SESSION_PREFIX + userId;

  // Remove from Redis if available
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.del(key);
      logger.debug(`${LOGGER_TAG_ID} Session removed from Redis for user: ${userId}`);
    } catch (error) {
      logger.error(`${LOGGER_TAG_ID} Error removing session from Redis: ${error.message}`);
    }
  }

  // Remove from memory store
  memoryStore.delete(userId);
  logger.debug(`${LOGGER_TAG_ID} Session removed from memory for user: ${userId}`);
}

module.exports = {
  getUserSession,
  setUserSession,
  removeUserSession
};
