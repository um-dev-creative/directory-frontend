const constants = require('../config/constants.util');
const express = require('express');
const router = express.Router();

let authController = require('../controller/directory-backend-auth.controller');
let registerController = require('../controller/directory-backend-register.controller');
let createUserController = require('../controller/directory-backend-create-user.controller');

 router.post(`${constants.INNER_ACCESS_TOKEN_PATH}*`, authController.proxyApi);
 router.delete('/drb/api/v1/auth/session-end*', authController.closeSession);
 router.post(`${constants.INNER_CREATE_USER_PATH}*`, createUserController.proxyApi);
 router.post(`${constants.INNER_VERIFY_CODE_PATH}*`, registerController.registerProxyApi);

module.exports = router;
