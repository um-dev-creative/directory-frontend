const constant = require('../config/constants.util');
const express = require('express');
const multer = require('multer');
const multimediaController = require('../controller/multimedia.controller');
const router = express.Router();

// Optimize memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit increased to 10MB
});

// Route for uploading business profile images — must be before the wildcard
router.post(`${constant.INNER_D_IMAGE_BUSINESS_PATH}/:businessId`, upload.single('image'), multimediaController.uploadBusinessImage);

// Route for uploading user profile images (wildcard — keep last)
router.post(`${constant.INNER_D_IMAGE_PATH}*`, upload.single('imageData'), multimediaController.uploadProfileImage);

module.exports = router;
