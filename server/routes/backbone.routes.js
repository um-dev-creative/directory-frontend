const express = require('express');
const router = express.Router();

let backboneProxyController = require('../controller/backbone.controller');

 router.all('/bkd/api/v1*', backboneProxyController.proxyApi);

module.exports = router;
