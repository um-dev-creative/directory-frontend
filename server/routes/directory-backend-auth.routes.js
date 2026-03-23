const constants = require('../config/constants.util');
const express = require('express');
const router = express.Router();
const verifyCodeLink = '/drb/api/v1/auth/verify-code*';
const sessionLink = '/drb/api/v1/auth/session-end*';

let authController = require('../controller/directory-backend-auth.controller');
let registerController = require('../controller/directory-backend-register.controller');
let createUserController = require('../controller/directory-backend-create-user.controller');

router.post(`${constants.INNER_ACCESS_TOKEN_PATH}*`, authController.proxyApi);
router.delete(sessionLink, authController.closeSession);
router.post(verifyCodeLink, registerController.registerProxyApi);
router.post(`${constants.INNER_CREATE_USER_PATH}*`, createUserController.proxyApi);

module.exports = router;
