// server/shared/redis-lock.js
// Distributed lock utility using Redis SET NX PX
const appConfig = require('../config/app.config');
const logger = appConfig.getLoggerApp();
const { v4: uuidv4 } = require('uuid');

const LOGGER_TAG_ID = '[REDIS_LOCK] :::';

/**
 * Acquire a distributed lock using Redis SET NX PX
 * @param {Object} redisClient - Redis client instance
 * @param {string} lockKey - Key for the lock
 * @param {number} ttlMs - Time to live in milliseconds (default 10000ms)
 * @returns {Promise<string|null>} Lock token if acquired, null otherwise
 */
async function acquireLock(redisClient, lockKey, ttlMs = 10000) {
  try {
    if (!redisClient || !redisClient.isReady) {
      logger.debug(`${LOGGER_TAG_ID} Redis client not available, skipping lock`);
      return null;
    }

    const lockToken = uuidv4();
    const result = await redisClient.set(lockKey, lockToken, {
      NX: true,
      PX: ttlMs
    });

    if (result === 'OK') {
      logger.debug(`${LOGGER_TAG_ID} Lock acquired for key: ${lockKey}`);
      return lockToken;
    }

    logger.debug(`${LOGGER_TAG_ID} Failed to acquire lock for key: ${lockKey}`);
    return null;
  } catch (error) {
    logger.error(`${LOGGER_TAG_ID} Error acquiring lock: ${error.message}`);
    return null;
  }
}

/**
 * Release a distributed lock using Lua script for compare-and-delete
 * @param {Object} redisClient - Redis client instance
 * @param {string} lockKey - Key for the lock
 * @param {string} lockToken - Token returned when lock was acquired
 * @returns {Promise<boolean>} True if lock was released, false otherwise
 */
async function releaseLock(redisClient, lockKey, lockToken) {
  try {
    if (!redisClient || !redisClient.isReady || !lockToken) {
      logger.debug(`${LOGGER_TAG_ID} Redis client not available or no token, skipping release`);
      return false;
    }

    // Lua script to compare and delete atomically
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    const result = await redisClient.eval(script, {
      keys: [lockKey],
      arguments: [lockToken]
    });

    if (result === 1) {
      logger.debug(`${LOGGER_TAG_ID} Lock released for key: ${lockKey}`);
      return true;
    }

    logger.debug(`${LOGGER_TAG_ID} Lock not released (already expired or wrong token) for key: ${lockKey}`);
    return false;
  } catch (error) {
    logger.error(`${LOGGER_TAG_ID} Error releasing lock: ${error.message}`);
    return false;
  }
}

/**
 * Execute a function with a distributed lock
 * @param {Object} redisClient - Redis client instance
 * @param {string} lockKey - Key for the lock
 * @param {Function} fn - Async function to execute with lock
 * @param {number} ttlMs - Time to live in milliseconds (default 10000ms)
 * @param {number} maxRetries - Maximum number of retries (default 3)
 * @param {number} retryDelayMs - Delay between retries in milliseconds (default 100ms)
 * @returns {Promise<any>} Result of the function execution
 */
async function withLock(redisClient, lockKey, fn, ttlMs = 10000, maxRetries = 3, retryDelayMs = 100) {
  let lockToken = null;
  let retries = 0;

  while (retries < maxRetries) {
    lockToken = await acquireLock(redisClient, lockKey, ttlMs);
    
    if (lockToken) {
      break;
    }

    retries++;
    if (retries < maxRetries) {
      logger.debug(`${LOGGER_TAG_ID} Lock retry ${retries}/${maxRetries} for key: ${lockKey}`);
      await new Promise(resolve => setTimeout(resolve, retryDelayMs));
    }
  }

  if (!lockToken) {
    logger.debug(`${LOGGER_TAG_ID} Could not acquire lock after ${maxRetries} retries, executing without lock`);
    // Execute without lock as fallback
    return await fn();
  }

  try {
    logger.debug(`${LOGGER_TAG_ID} Executing function with lock: ${lockKey}`);
    return await fn();
  } finally {
    await releaseLock(redisClient, lockKey, lockToken);
  }
}

module.exports = {
  acquireLock,
  releaseLock,
  withLock
};
