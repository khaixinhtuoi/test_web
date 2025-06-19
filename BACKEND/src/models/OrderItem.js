const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  unit_price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  total_price: {
    type: Number,
    required: true,
    min: 0
  }
});

// Tính total_price trước khi lưu
orderItemSchema.pre('save', function(next) {
  this.total_price = this.unit_price * this.quantity;
  next();
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem; 