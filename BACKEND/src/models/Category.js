const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; 