'use strict';

const express = require('express');
const router = express.Router();
const landingController = require('../controller/landing.controller');

// GET /api/landing
router.get('/', landingController.getLanding);

module.exports = router;
