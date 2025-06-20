const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const routes = require('./routes');
const { errorMiddleware } = require('./middlewares');
const { cleanupExpiredTokens } = require('./utils/cleanupTokens');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Kết nối database
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://truong2004ko:Truong2k4@cluster0daotruongdev.uu48g23.mongodb.net/khaicute?retryWrites=true&w=majority&appName=Cluster0DaoTruongDev')
  .then(() => {
    console.log('Đã kết nối với MongoDB');
    
    // Thiết lập tác vụ định kỳ xóa refresh token hết hạn (chạy mỗi 24 giờ)
    setInterval(async () => {
      try {
        const deletedCount = await cleanupExpiredTokens();
        console.log(`Tác vụ dọn dẹp: Đã xóa ${deletedCount} refresh token`);
      } catch (error) {
        console.error('Lỗi khi chạy tác vụ dọn dẹp:', error);
      }
    }, 24 * 60 * 60 * 1000); // 24 giờ
  })
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Sử dụng routes
app.use(routes);

// Route mặc định
app.get('/', (req, res) => {
  res.send('API đang hoạt động');
});

// Middleware xử lý lỗi
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

// Lắng nghe server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});