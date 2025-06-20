const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://truong2004ko:Truong2k4@cluster0daotruongdev.uu48g23.mongodb.net/khaicute?retryWrites=true&w=majority&appName=Cluster0DaoTruongDev');
    console.log('Connected to MongoDB');

    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: 'admin@techstore.com' });
    if (existingAdmin) {
      console.log('Admin account already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      return;
    }

    // Tạo tài khoản admin
    const admin = new User({
      email: 'admin@techstore.com',
      password: 'admin123',
      first_name: 'Admin',
      last_name: 'TechStore',
      phone: '0123456789',
      address: 'TechStore HQ',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin account created successfully!');
    console.log('Email: admin@techstore.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createAdmin();
