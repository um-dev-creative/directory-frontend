// server/shared/redis-lock.js
// Distributed lock utility using Redis SET NX PX with safe release
const { v4: uuidv4 } = require('uuid');
const appConfig = require('../config/app.config');
const logger = appConfig.getLoggerApp();

const LOGGER_TAG_ID = '[REDIS_LOCK] :::';

/**
 * Acquires a distributed lock in Redis
 * @param {Object} redisClient - Redis client instance
 * @param {string} lockKey - The key to lock
 * @param {number} ttlMs - Time to live in milliseconds (default: 10000)
 * @returns {Promise<string|null>} - Lock token if acquired, null otherwise
 */
async function acquireLock(redisClient, lockKey, ttlMs = 10000) {
  if (!redisClient || !redisClient.isOpen) {
    logger.warn(`${LOGGER_TAG_ID} Redis client not available, skipping lock`);
    return null;
  }

  const lockToken = uuidv4();
  try {
    // SET key value NX PX milliseconds
    const result = await redisClient.set(lockKey, lockToken, {
      NX: true,
      PX: ttlMs
    });
    
    if (result === 'OK') {
      logger.debug(`${LOGGER_TAG_ID} Lock acquired: ${lockKey}`);
      return lockToken;
    }
    
    logger.debug(`${LOGGER_TAG_ID} Lock already held: ${lockKey}`);
    return null;
  } catch (error) {
    logger.error(`${LOGGER_TAG_ID} Error acquiring lock: ${error.message}`);
    return null;
  }
}

/**
 * Releases a distributed lock in Redis using compare-and-delete
 * @param {Object} redisClient - Redis client instance
 * @param {string} lockKey - The key to unlock
 * @param {string} lockToken - The token that was returned when acquiring the lock
 * @returns {Promise<boolean>} - True if released, false otherwise
 */
async function releaseLock(redisClient, lockKey, lockToken) {
  if (!redisClient || !redisClient.isOpen || !lockToken) {
    return false;
  }

  try {
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
      logger.debug(`${LOGGER_TAG_ID} Lock released: ${lockKey}`);
      return true;
    }
    
    logger.debug(`${LOGGER_TAG_ID} Lock not released (token mismatch or expired): ${lockKey}`);
    return false;
  } catch (error) {
    logger.error(`${LOGGER_TAG_ID} Error releasing lock: ${error.message}`);
    return false;
  }
}

/**
 * Executes a function with a distributed lock
 * @param {Object} redisClient - Redis client instance
 * @param {string} lockKey - The key to lock
 * @param {Function} fn - The function to execute while holding the lock
 * @param {number} ttlMs - Time to live in milliseconds
 * @returns {Promise<any>} - Result of the function
 */
async function withLock(redisClient, lockKey, fn, ttlMs = 10000) {
  const lockToken = await acquireLock(redisClient, lockKey, ttlMs);
  
  if (!lockToken) {
    // Lock not acquired, wait and retry or throw
    throw new Error(`Failed to acquire lock: ${lockKey}`);
  }

  try {
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
