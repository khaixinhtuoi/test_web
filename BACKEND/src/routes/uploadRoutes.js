const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { upload, handleUploadError } = require('../middleware/upload');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware xác thực cho tất cả routes upload
router.use(authMiddleware.protect);

// Route upload single image
router.post('/image', 
  upload.single('image'), 
  handleUploadError,
  uploadController.uploadImage
);

// Route upload multiple images
router.post('/images', 
  upload.array('images', 5), // Tối đa 5 ảnh
  handleUploadError,
  uploadController.uploadMultipleImages
);

// Route delete image (chỉ admin)
router.delete('/image/:filename', 
  authMiddleware.admin,
  uploadController.deleteImage
);

module.exports = router;
