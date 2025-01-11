const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/', limits: {fileSize: 200*1024*1024}});

let directoryProxyController = require('../controller/directory-backend.controller');

 router.all('/api/v1*', directoryProxyController.proxyApi);

module.exports = router;
