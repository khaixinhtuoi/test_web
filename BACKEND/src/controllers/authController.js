const { User, RefreshToken } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../utils');

/**
 * Đăng nhập người dùng với refresh token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Access token, refresh token và thông tin người dùng
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    
    // Kiểm tra trạng thái người dùng
    if (!user.is_active) {
      return res.status(401).json({ message: 'Tài khoản đã bị khóa' });
    }
    
    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    
    // Tạo access token
    const accessToken = generateAccessToken(user);
    
    // Tạo refresh token
    const reqInfo = {
      userAgent: req.headers['user-agent'],
      ip: req.ip
    };
    const refreshTokenData = await generateRefreshToken(user, reqInfo);
    
    // Trả về thông tin người dùng (không bao gồm mật khẩu)
    const userObject = user.toObject();
    delete userObject.password;
    
    // Thiết lập refresh token trong cookie (httpOnly, secure)
    res.cookie('refreshToken', refreshTokenData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
      path: '/api/auth/refresh-token'
    });
    
    res.status(200).json({
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken: refreshTokenData.token, // Tùy chọn: có thể không trả về refresh token
      user: userObject
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Refresh access token bằng refresh token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Access token mới
 */
exports.refreshToken = async (req, res) => {
  try {
    // Lấy refresh token từ cookie hoặc body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token không được cung cấp' });
    }
    
    // Tìm refresh token trong DB
    const tokenDoc = await RefreshToken.findOne({ 
      token: refreshToken,
      is_revoked: false,
      expires_at: { $gt: new Date() }
    });
    
    if (!tokenDoc) {
      return res.status(401).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }
    
    // Tìm user
    const user = await User.findById(tokenDoc.user_id);
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Người dùng không tồn tại hoặc đã bị khóa' });
    }
    
    // Tạo access token mới
    const accessToken = generateAccessToken(user);
    
    res.status(200).json({
      accessToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Đăng xuất - thu hồi refresh token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông báo kết quả
 */
exports.logout = async (req, res) => {
  try {
    // Lấy refresh token từ cookie hoặc body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (refreshToken) {
      // Đánh dấu token là đã thu hồi
      await RefreshToken.findOneAndUpdate(
        { token: refreshToken },
        { is_revoked: true }
      );
      
      // Xóa cookie
      res.clearCookie('refreshToken');
    }
    
    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Lấy danh sách phiên đăng nhập của người dùng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Danh sách phiên đăng nhập
 */
exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Lấy danh sách refresh token còn hiệu lực
    const sessions = await RefreshToken.find({
      user_id: userId,
      is_revoked: false,
      expires_at: { $gt: new Date() }
    }).select('device_info ip_address created_at');
    
    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Thu hồi một phiên đăng nhập cụ thể
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông báo kết quả
 */
exports.revokeSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    
    // Thu hồi token
    const result = await RefreshToken.findOneAndUpdate(
      { _id: sessionId, user_id: userId },
      { is_revoked: true }
    );
    
    if (!result) {
      return res.status(404).json({ message: 'Không tìm thấy phiên đăng nhập' });
    }
    
    res.status(200).json({ message: 'Đã thu hồi phiên đăng nhập' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Thu hồi tất cả phiên đăng nhập trừ phiên hiện tại
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông báo kết quả
 */
exports.revokeAllSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentToken = req.cookies.refreshToken || req.body.refreshToken;
    
    // Thu hồi tất cả token trừ token hiện tại
    await RefreshToken.updateMany(
      { 
        user_id: userId, 
        token: { $ne: currentToken },
        is_revoked: false
      },
      { is_revoked: true }
    );
    
    res.status(200).json({ message: 'Đã thu hồi tất cả phiên đăng nhập khác' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}; 