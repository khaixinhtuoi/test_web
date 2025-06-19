const { RefreshToken } = require('../models');

/**
 * Xóa các refresh token đã hết hạn hoặc đã thu hồi
 * Hàm này nên được chạy định kỳ (ví dụ: mỗi ngày)
 */
const cleanupExpiredTokens = async () => {
  try {
    const now = new Date();
    
    // Xóa các token đã hết hạn hoặc đã thu hồi
    const result = await RefreshToken.deleteMany({
      $or: [
        { expires_at: { $lt: now } },
        { is_revoked: true }
      ]
    });
    
    console.log(`Đã xóa ${result.deletedCount} refresh token hết hạn hoặc đã thu hồi`);
    return result.deletedCount;
  } catch (error) {
    console.error('Lỗi khi xóa refresh token:', error);
    throw error;
  }
};

module.exports = {
  cleanupExpiredTokens
}; 