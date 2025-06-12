const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/', limits: {fileSize: 200 * 1024 * 1024}});

let authController = require('../controller/directory-backend-auth.controller');
let registerController = require('../controller/directory-backend-std.controller');
let standardController = require('../controller/directory-backend-std.controller');
let createUserController = require('../controller/directory-backend-create-user.controller');

router.post('/drb/api/v1/auth/access-token*', authController.proxyApi);
// router.post('/drb/api/v1/auth/verify-code*', registerController.proxyApi);
router.all('/drb/api/v1/gen/users/*', standardController.proxyApi);
router.post('/drb/api/v1/auth/create-user*', createUserController.proxyApi);

module.exports = router;
