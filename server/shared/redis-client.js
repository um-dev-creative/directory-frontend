// server/shared/redis-client.js
// Redis client singleton with connection management
const { createClient } = require('redis');
const appConfig = require('../config/app.config');
const logger = appConfig.getLoggerApp();

const LOGGER_TAG_ID = '[REDIS_CLIENT] :::';

let redisClient = null;
let isConnecting = false;

/**
 * Get or create Redis client instance
 * @returns {Promise<Object|null>} Redis client or null if connection fails
 */
async function getRedisClient() {
  // Return existing client if connected
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // Don't create multiple connections simultaneously
  if (isConnecting) {
    logger.debug(`${LOGGER_TAG_ID} Already connecting to Redis, waiting...`);
    // Wait a bit and retry
    await new Promise(resolve => setTimeout(resolve, 100));
    return getRedisClient();
  }

  // Check if Redis URL is configured
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    logger.warn(`${LOGGER_TAG_ID} REDIS_URL not configured, Redis features disabled`);
    return null;
  }

  try {
    isConnecting = true;
    logger.info(`${LOGGER_TAG_ID} Connecting to Redis...`);

    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error(`${LOGGER_TAG_ID} Max reconnection attempts reached`);
            return new Error('Max reconnection attempts reached');
          }
          const delay = Math.min(retries * 100, 3000);
          logger.debug(`${LOGGER_TAG_ID} Reconnecting to Redis in ${delay}ms...`);
          return delay;
        }
      }
    });

    // Set up error handler
    redisClient.on('error', (err) => {
      logger.error(`${LOGGER_TAG_ID} Redis client error: ${err.message}`);
    });

    // Set up ready handler
    redisClient.on('ready', () => {
      logger.info(`${LOGGER_TAG_ID} Redis client ready`);
    });

    // Connect
    await redisClient.connect();
    logger.info(`${LOGGER_TAG_ID} Successfully connected to Redis`);

    return redisClient;
  } catch (error) {
    logger.error(`${LOGGER_TAG_ID} Failed to connect to Redis: ${error.message}`);
    redisClient = null;
    return null;
  } finally {
    isConnecting = false;
  }
}

/**
 * Close Redis connection
 */
async function closeRedisClient() {
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.quit();
      logger.info(`${LOGGER_TAG_ID} Redis connection closed`);
    } catch (error) {
      logger.error(`${LOGGER_TAG_ID} Error closing Redis connection: ${error.message}`);
    }
    redisClient = null;
  }
}

module.exports = {
  getRedisClient,
  closeRedisClient
};
