const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  added_at: {
    type: Date,
    default: Date.now
  }
});

// Tạo index cho cặp user_id và product_id để đảm bảo mỗi sản phẩm chỉ xuất hiện một lần trong giỏ hàng của người dùng
cartItemSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem; 