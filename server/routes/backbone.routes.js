const constant = require('../config/constants.util');
const express = require('express');
const router = express.Router();

let backboneProxyController = require('../controller/backbone.controller');

router.all(`${constant.INNER_BACKBONE_PATH}*`, backboneProxyController.proxyApi);

module.exports = router;
