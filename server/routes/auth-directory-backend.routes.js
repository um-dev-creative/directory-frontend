const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/', limits: {fileSize: 200*1024*1024}});

let authDirectoryBackendProxyController = require('../controller/auth-directory-backend.controller');

 router.all('/auth/drb/api/v1/auth*', authDirectoryBackendProxyController.proxyApi);
 router.all('/auth/drb/api/v1/user-register*', authDirectoryBackendProxyController.proxyApi);

module.exports = router;
