const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối với MongoDB'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Routes
app.get('/', (req, res) => {
  res.send('API đang hoạt động');
});

// Lắng nghe server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});