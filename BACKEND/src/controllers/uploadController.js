const path = require('path');

/**
 * Upload single image
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Upload result
 */
exports.uploadImage = async (req, res) => {
  try {
    console.log('=== UPLOAD IMAGE REQUEST ===');
    console.log('File:', req.file);
    console.log('User:', req.user);

    if (!req.file) {
      return res.status(400).json({
        message: 'Không có file nào được upload'
      });
    }

    // Tạo URL cho file đã upload
    const fileUrl = `/uploads/${req.file.filename}`;
    
    console.log('File uploaded successfully:', fileUrl);

    res.status(200).json({
      message: 'Upload ảnh thành công',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('=== UPLOAD ERROR ===');
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi upload ảnh', 
      error: error.message 
    });
  }
};

/**
 * Upload multiple images
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Upload result
 */
exports.uploadMultipleImages = async (req, res) => {
  try {
    console.log('=== UPLOAD MULTIPLE IMAGES REQUEST ===');
    console.log('Files:', req.files);
    console.log('User:', req.user);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'Không có file nào được upload'
      });
    }

    // Tạo URLs cho các file đã upload
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`
    }));
    
    console.log('Files uploaded successfully:', uploadedFiles.length);

    res.status(200).json({
      message: `Upload ${uploadedFiles.length} ảnh thành công`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('=== UPLOAD MULTIPLE ERROR ===');
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi upload ảnh', 
      error: error.message 
    });
  }
};

/**
 * Delete uploaded image
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Delete result
 */
exports.deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const fs = require('fs');
    const filePath = path.join(__dirname, '../../uploads', filename);

    console.log('=== DELETE IMAGE REQUEST ===');
    console.log('Filename:', filename);
    console.log('File path:', filePath);

    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: 'File không tồn tại'
      });
    }

    // Xóa file
    fs.unlinkSync(filePath);
    
    console.log('File deleted successfully:', filename);

    res.status(200).json({
      message: 'Xóa ảnh thành công'
    });
  } catch (error) {
    console.error('=== DELETE IMAGE ERROR ===');
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi xóa ảnh', 
      error: error.message 
    });
  }
};
