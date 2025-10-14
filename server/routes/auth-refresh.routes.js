/**
 * Auth refresh routes
 */
'use strict';

const express = require('express');
const router = express.Router();
const authRefreshController = require('../controller/auth-refresh.controller');

/**
 * POST /api/auth/refresh
 * Refresh user session token
 */
router.post('/refresh', authRefreshController.refreshToken);

module.exports = router;
