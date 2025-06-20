const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const { User, Category, Product } = require('../src/models');

const seedData = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://truong2004ko:Truong2k4@cluster0daotruongdev.uu48g23.mongodb.net/khaicute?retryWrites=true&w=majority&appName=Cluster0DaoTruongDev');
    console.log('Đã kết nối với MongoDB');

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Đã xóa dữ liệu cũ');

    // Tạo admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      email: 'admin@techstore.vn',
      password: adminPassword,
      first_name: 'Admin',
      last_name: 'TechStore',
      phone: '0123456789',
      role: 'admin'
    });
    console.log('Đã tạo admin user');

    // Tạo customer user
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customerUser = await User.create({
      email: 'customer@example.com',
      password: customerPassword,
      first_name: 'Khách',
      last_name: 'Hàng',
      phone: '0987654321',
      role: 'customer'
    });
    console.log('Đã tạo customer user');

    // Tạo categories
    const categories = await Category.insertMany([
      { category_name: 'Điện thoại' },
      { category_name: 'Laptop' },
      { category_name: 'Tablet' },
      { category_name: 'Smartwatch' },
      { category_name: 'Tai nghe' },
      { category_name: 'Phụ kiện' }
    ]);
    console.log('Đã tạo categories');

    // Tạo products
    const products = [
      {
        product_name: 'iPhone 16 Pro Max 256GB',
        category_id: categories[0]._id, // Điện thoại
        brand: 'Apple',
        price: 31990000,
        stock_quantity: 15,
        description: 'iPhone 16 Pro Max với chip A18 Pro mạnh mẽ, camera 48MP và màn hình Super Retina XDR 6.9 inch',
        image_url: '/images/iphone-16-pro-max.jpg'
      },
      {
        product_name: 'Samsung Galaxy S24 Ultra',
        category_id: categories[0]._id, // Điện thoại
        brand: 'Samsung',
        price: 29990000,
        stock_quantity: 12,
        description: 'Galaxy S24 Ultra với S Pen tích hợp, camera 200MP và màn hình Dynamic AMOLED 2X',
        image_url: '/images/galaxy-s24-ultra.jpg'
      },
      {
        product_name: 'MacBook Pro M3 14 inch',
        category_id: categories[1]._id, // Laptop
        brand: 'Apple',
        price: 39990000,
        stock_quantity: 8,
        description: 'MacBook Pro với chip M3, màn hình Liquid Retina XDR 14 inch và thời lượng pin lên đến 18 giờ',
        image_url: '/images/macbook-pro-m3.jpg'
      },
      {
        product_name: 'Dell XPS 13 Plus',
        category_id: categories[1]._id, // Laptop
        brand: 'Dell',
        price: 32990000,
        stock_quantity: 5,
        description: 'Laptop Dell XPS 13 Plus với thiết kế siêu mỏng, màn hình InfinityEdge và hiệu năng mạnh mẽ',
        image_url: '/images/dell-xps-13.jpg'
      },
      {
        product_name: 'iPad Pro M2 11 inch',
        category_id: categories[2]._id, // Tablet
        brand: 'Apple',
        price: 24990000,
        stock_quantity: 10,
        description: 'iPad Pro với chip M2, màn hình Liquid Retina 11 inch và hỗ trợ Apple Pencil thế hệ 2',
        image_url: '/images/ipad-pro-m2.jpg'
      },
      {
        product_name: 'Samsung Galaxy Tab S9',
        category_id: categories[2]._id, // Tablet
        brand: 'Samsung',
        price: 19990000,
        stock_quantity: 0, // Hết hàng
        description: 'Galaxy Tab S9 với màn hình Dynamic AMOLED 2X và S Pen đi kèm',
        image_url: '/images/galaxy-tab-s9.jpg'
      },
      {
        product_name: 'Apple Watch Series 9',
        category_id: categories[3]._id, // Smartwatch
        brand: 'Apple',
        price: 10990000,
        stock_quantity: 20,
        description: 'Apple Watch Series 9 với chip S9, màn hình Retina Always-On và tính năng sức khỏe tiên tiến',
        image_url: '/images/apple-watch-s9.jpg'
      },
      {
        product_name: 'Sony WH-1000XM5',
        category_id: categories[4]._id, // Tai nghe
        brand: 'Sony',
        price: 8490000,
        stock_quantity: 25,
        description: 'Tai nghe chống ồn hàng đầu với chất lượng âm thanh Hi-Res và thời lượng pin 30 giờ',
        image_url: '/images/sony-wh1000xm5.jpg'
      },
      {
        product_name: 'AirPods Pro 2',
        category_id: categories[4]._id, // Tai nghe
        brand: 'Apple',
        price: 6990000,
        stock_quantity: 30,
        description: 'AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động và âm thanh không gian',
        image_url: '/images/airpods-pro-2.jpg'
      },
      {
        product_name: 'Ốp lưng iPhone 16 Pro Max',
        category_id: categories[5]._id, // Phụ kiện
        brand: 'Apple',
        price: 1290000,
        stock_quantity: 50,
        description: 'Ốp lưng silicone chính hãng Apple cho iPhone 16 Pro Max với nhiều màu sắc',
        image_url: '/images/iphone-case.jpg'
      }
    ];

    await Product.insertMany(products);
    console.log('Đã tạo products');

    console.log('\n=== THÔNG TIN ĐĂNG NHẬP ===');
    console.log('Admin:');
    console.log('  Email: admin@techstore.vn');
    console.log('  Password: admin123');
    console.log('\nCustomer:');
    console.log('  Email: customer@example.com');
    console.log('  Password: customer123');

    console.log('\nSeed data thành công!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi seed data:', error);
    process.exit(1);
  }
};

seedData();
