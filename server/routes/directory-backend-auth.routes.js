const express = require('express');
const router = express.Router();

let authController = require('../controller/directory-backend-auth.controller');
let registerController = require('../controller/directory-backend-register.controller');
let createUserController = require('../controller/directory-backend-create-user.controller');

 router.post('/drb/api/v1/auth/access-token*', authController.proxyApi);
 router.delete('/drb/api/v1/auth/session-end*', authController.closeSession);
 router.post('/drb/api/v1/auth/verify-code*', registerController.registerProxyApi);
 router.post('/drb/api/v1/auth/create-user*', createUserController.proxyApi);

module.exports = router;
