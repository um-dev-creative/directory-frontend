const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/', limits: {fileSize: 200*1024*1024}});

let backboneProxyController = require('../controller/backbone.controller');

 router.all('/bkd/api/v1*', backboneProxyController.proxyApi);

module.exports = router;
