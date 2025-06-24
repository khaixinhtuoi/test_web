const mongoose = require('mongoose');
require('dotenv').config();

// User schema với date_of_birth
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true,
    default: null
  },
  date_of_birth: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

const User = mongoose.model('User', userSchema);

async function testDatabaseConnection() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://truong2004ko:Truong2k4@cluster0daotruongdev.uu48g23.mongodb.net/khaicute?retryWrites=true&w=majority&appName=Cluster0DaoTruongDev');
    
    console.log('✅ Connected to MongoDB successfully');

    // Test tạo user với date_of_birth
    console.log('\n📝 Testing user creation with date_of_birth...');
    
    const testUser = {
      email: 'test-dob-direct@example.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User',
      phone: '0123456789',
      address: '123 Test Street',
      date_of_birth: new Date('1990-05-15')
    };

    // Xóa user cũ nếu tồn tại
    await User.deleteOne({ email: testUser.email });

    // Tạo user mới
    const newUser = new User(testUser);
    await newUser.save();
    
    console.log('✅ User created successfully');
    console.log('📅 Date of Birth:', newUser.date_of_birth);

    // Test update date_of_birth
    console.log('\n🔄 Testing date_of_birth update...');
    
    newUser.date_of_birth = new Date('1985-12-25');
    await newUser.save();
    
    console.log('✅ Date of Birth updated successfully');
    console.log('📅 New Date of Birth:', newUser.date_of_birth);

    // Test clear date_of_birth
    console.log('\n🗑️ Testing date_of_birth clearing...');
    
    newUser.date_of_birth = null;
    await newUser.save();
    
    console.log('✅ Date of Birth cleared successfully');
    console.log('📅 Date of Birth (should be null):', newUser.date_of_birth);

    // Test find user
    console.log('\n🔍 Testing user retrieval...');
    
    const foundUser = await User.findOne({ email: testUser.email });
    console.log('✅ User found successfully');
    console.log('👤 User data:', {
      name: `${foundUser.first_name} ${foundUser.last_name}`,
      email: foundUser.email,
      phone: foundUser.phone,
      address: foundUser.address,
      date_of_birth: foundUser.date_of_birth
    });

    console.log('\n🎉 All database tests passed! Date of Birth field is working correctly in MongoDB.');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the test
testDatabaseConnection();
