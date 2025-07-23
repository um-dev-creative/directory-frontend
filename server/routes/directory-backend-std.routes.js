const constants = require('../config/constants.util');
const express = require('express');
const router = express.Router();

let standardController = require('../controller/directory-backend-std.controller');

router.all(`${constants.INNER_GENERAL_PATH}*`, standardController.proxyApi);

module.exports = router;
