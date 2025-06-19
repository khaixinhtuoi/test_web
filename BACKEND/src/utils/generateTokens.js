const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { RefreshToken } = require('../models');

/**
 * Tạo access token JWT từ thông tin người dùng
 * @param {Object} user - Thông tin người dùng
 * @returns {String} - JWT token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1h' } // Giảm thời gian sống của access token xuống 1 giờ
  );
};

/**
 * Tạo refresh token và lưu vào DB
 * @param {Object} user - Thông tin người dùng
 * @param {Object} reqInfo - Thông tin request (optional)
 * @returns {Object} - Refresh token và thời gian hết hạn
 */
const generateRefreshToken = async (user, reqInfo = {}) => {
  // Tạo refresh token ngẫu nhiên
  const refreshToken = crypto.randomBytes(40).toString('hex');
  
  // Tính thời gian hết hạn (30 ngày)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  // Lưu refresh token vào DB
  await RefreshToken.create({
    token: refreshToken,
    user_id: user._id,
    device_info: reqInfo.userAgent || 'Unknown device',
    ip_address: reqInfo.ip || '',
    expires_at: expiresAt
  });
  
  return {
    token: refreshToken,
    expires_at: expiresAt
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
}; 