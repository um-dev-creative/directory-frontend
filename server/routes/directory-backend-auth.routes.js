const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/', limits: {fileSize: 200*1024*1024}});

let authController = require('../controller/directory-backend-auth.controller');
let registerController = require('../controller/directory-backend-register.controller');

 router.all('/auth/drb/api/v1/auth*', authController.proxyApi);
 router.post('/auth/drb/api/v1/user-register*', registerController.registerProxyApi);

module.exports = router;
