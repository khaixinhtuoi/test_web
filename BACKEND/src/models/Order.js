const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order_number: {
    type: String,
    required: true,
    unique: true
  },
  order_status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
    default: 'pending'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shipping_fee: {
    type: Number,
    required: true,
    min: 0
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  shipping_recipient_name: {
    type: String,
    required: true,
    trim: true
  },
  shipping_address: {
    type: String,
    required: true,
    trim: true
  },
  payment_method: {
    type: String,
    enum: ['cod', 'bank', 'momo', 'COD', 'Bank Transfer'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Tạo order_number trước khi lưu
orderSchema.pre('save', async function(next) {
  try {
    if (this.isNew && !this.order_number) {
      const count = await mongoose.model('Order').countDocuments();
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      this.order_number = `ORD-${year}${month}${day}-${(count + 1).toString().padStart(4, '0')}`;
      console.log('Generated order_number:', this.order_number);
    }
    next();
  } catch (error) {
    console.error('Error generating order_number:', error);
    next(error);
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 