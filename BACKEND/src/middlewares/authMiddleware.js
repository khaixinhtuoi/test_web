const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware bảo vệ các route yêu cầu đăng nhập
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.protect = async (req, res, next) => {
  try {
    // Lấy token từ header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Kiểm tra token tồn tại
    if (!token) {
      return res.status(401).json({ message: 'Không có quyền truy cập, vui lòng đăng nhập' });
    }
    
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Kiểm tra người dùng tồn tại
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }
    
    // Kiểm tra trạng thái người dùng
    if (!user.is_active) {
      return res.status(401).json({ message: 'Tài khoản đã bị khóa' });
    }
    
    // Gán thông tin người dùng vào request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn', error: error.message });
  }
};

/**
 * Middleware kiểm tra quyền admin
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Không có quyền truy cập, yêu cầu quyền admin' });
  }
}; 