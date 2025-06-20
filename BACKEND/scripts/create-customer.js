const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const createCustomer = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://truong2004ko:Truong2k4@cluster0daotruongdev.uu48g23.mongodb.net/khaicute?retryWrites=true&w=majority&appName=Cluster0DaoTruongDev');
    console.log('Connected to MongoDB');

    // Kiểm tra xem customer đã tồn tại chưa
    const existingCustomer = await User.findOne({ email: 'customer@techstore.com' });
    if (existingCustomer) {
      console.log('Customer account already exists');
      console.log('Email:', existingCustomer.email);
      console.log('Role:', existingCustomer.role);
      return;
    }

    // Tạo tài khoản customer
    const customer = new User({
      email: 'customer@techstore.com',
      password: 'customer123',
      first_name: 'Khách',
      last_name: 'Hàng',
      phone: '0987654321',
      address: 'Hà Nội',
      role: 'customer'
    });

    await customer.save();
    console.log('Customer account created successfully!');
    console.log('Email: customer@techstore.com');
    console.log('Password: customer123');
    console.log('Role: customer');

  } catch (error) {
    console.error('Error creating customer:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createCustomer();
