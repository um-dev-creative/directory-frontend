/**
 * Auth refresh controller for handling token refresh requests
 */
'use strict';

const appConfig = require('../config/app.config');
const constants = require('../config/constants.util.js');
const logger = appConfig.getLoggerApp();
const redisSessionStore = require('../shared/redis-session-store');
const { backboneRenewToken } = require('./backbone.controller');
const { getUserId } = require("../shared/oauth-common-function");

const LOGGER_TAG_ID = '[AUTH_REFRESH_CONTROLLER] :::';

/**
 * Refresh the user's session token
 * POST /api/auth/refresh
 * 
 * Expects either:
 * - A session cookie with userId
 * - A header with userId
 * - A body with userId or token
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const refreshToken = async (req, res) => {
  try {
    logger.info(`${LOGGER_TAG_ID} Refresh token request received`);
    
    // Try to get userId from different sources
    let userId = null;
    
    // 1. Try from body
    if (req.body.userId) {
      userId = req.body.userId;
      logger.debug(`${LOGGER_TAG_ID} userId from body: ${userId}`);
    }
    
    // 2. Try to extract from token in body
    if (!userId && req.body.token) {
      userId = getUserId(req.body.token);
      logger.debug(`${LOGGER_TAG_ID} userId extracted from token: ${userId}`);
    }
    
    // 3. Try from headers
    if (!userId && req.headers['x-user-id']) {
      userId = req.headers['x-user-id'];
      logger.debug(`${LOGGER_TAG_ID} userId from header: ${userId}`);
    }
    
    // 4. Try from session cookie (if implemented)
    if (!userId && req.session?.userId) {
      userId = req.session.userId;
      logger.debug(`${LOGGER_TAG_ID} userId from session: ${userId}`);
    }
    
    if (!userId) {
      logger.warn(`${LOGGER_TAG_ID} No userId provided in refresh request`);
      return res.status(400).json({
        error: 'Bad Request',
        message: 'userId or token is required'
      });
    }
    
    // Get current session
    const session = await redisSessionStore.getUserSession(userId);
    
    if (!session) {
      logger.warn(`${LOGGER_TAG_ID} No session found for userId: ${userId}`);
      return res.status(404).json({
        error: 'Not Found',
        message: 'Session not found'
      });
    }
    
    // Check if session is close to expiration (within 5 minutes)
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    const needsRefresh = session.backboneSessionExpiresAt && 
                        (session.backboneSessionExpiresAt - now) < fiveMinutes;
    
    if (needsRefresh) {
      logger.info(`${LOGGER_TAG_ID} Session needs refresh for userId: ${userId}`);
      
      try {
        const newToken = await backboneRenewToken(userId);
        
        logger.info(`${LOGGER_TAG_ID} Token refreshed successfully for userId: ${userId}`);
        
        // Get updated session
        const updatedSession = await redisSessionStore.getUserSession(userId);
        
        return res.status(200).json({
          message: 'Token refreshed successfully',
          token: newToken,
          expiresAt: updatedSession?.backboneSessionExpiresAt
        });
      } catch (error) {
        logger.error(`${LOGGER_TAG_ID} Error refreshing token: ${error.message}`);
        return res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to refresh token'
        });
      }
    } else {
      logger.info(`${LOGGER_TAG_ID} Session still valid for userId: ${userId}`);
      return res.status(200).json({
        message: 'Session still valid',
        token: session.backboneSession,
        expiresAt: session.backboneSessionExpiresAt
      });
    }
  } catch (error) {
    logger.error(`${LOGGER_TAG_ID} Error in refreshToken: ${error.message}`);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process refresh request'
    });
  }
};

module.exports = {
  refreshToken
};
