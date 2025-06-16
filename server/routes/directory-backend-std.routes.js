const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/', limits: {fileSize: 200*1024*1024}});

let standardController = require('../controller/directory-backend-std.controller');

router.get('/drb/api/v1/general/*', standardController.proxyApi);

module.exports = router;
