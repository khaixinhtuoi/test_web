const jwt = require('jsonwebtoken');

/**
 * Tạo JWT token từ thông tin người dùng
 * @param {Object} user - Thông tin người dùng
 * @returns {String} - JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '24h' }
  );
};

module.exports = generateToken; 