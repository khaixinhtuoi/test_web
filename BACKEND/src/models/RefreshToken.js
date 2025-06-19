const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  device_info: {
    type: String,
    default: 'Unknown device'
  },
  ip_address: {
    type: String,
    default: ''
  },
  is_revoked: {
    type: Boolean,
    default: false
  },
  expires_at: {
    type: Date,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Tạo index cho token để tìm kiếm nhanh
refreshTokenSchema.index({ token: 1 });

// Tạo index cho user_id để tìm tất cả token của một user
refreshTokenSchema.index({ user_id: 1 });

// Tạo index cho expires_at để xóa token hết hạn
refreshTokenSchema.index({ expires_at: 1 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken; 