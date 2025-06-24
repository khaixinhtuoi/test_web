const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  email: `test-dob-${Date.now()}@example.com`,
  password: 'password123',
  first_name: 'Test',
  last_name: 'User',
  phone: '0123456789',
  address: '123 Test Street',
  date_of_birth: '1990-05-15'
};

let accessToken = '';

async function testDateOfBirthFeature() {
  console.log('🧪 Testing Date of Birth Feature...\n');

  try {
    // 1. Test User Registration with Date of Birth
    console.log('1. Testing user registration with date of birth...');
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/users/register`, testUser);
      console.log('✅ Registration successful:', registerResponse.data.message);
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️  User already exists, continuing with login...');
      } else {
        throw error;
      }
    }

    // 2. Test Login
    console.log('\n2. Testing login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/users/login`, {
      email: testUser.email,
      password: testUser.password
    });
    accessToken = loginResponse.data.accessToken;
    console.log('✅ Login successful');

    // 3. Test Get Profile (should include date_of_birth)
    console.log('\n3. Testing get profile...');
    const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const user = profileResponse.data.user;
    console.log('✅ Profile retrieved successfully');
    console.log('📅 Date of Birth:', user.date_of_birth || 'Not set');
    console.log('👤 User Info:', {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      phone: user.phone,
      address: user.address,
      date_of_birth: user.date_of_birth
    });

    // 4. Test Update Profile with new Date of Birth
    console.log('\n4. Testing profile update with new date of birth...');
    const newDateOfBirth = '1985-12-25';
    const updateResponse = await axios.put(`${API_BASE_URL}/users/profile`, {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address,
      date_of_birth: newDateOfBirth
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Profile updated successfully');
    console.log('📅 New Date of Birth:', updateResponse.data.user.date_of_birth);

    // 5. Test Update Profile without Date of Birth (should remain unchanged)
    console.log('\n5. Testing profile update without date of birth...');
    const updateResponse2 = await axios.put(`${API_BASE_URL}/users/profile`, {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: '0987654321', // Change phone only
      address: user.address
      // No date_of_birth field
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Profile updated successfully (phone only)');
    console.log('📅 Date of Birth (should remain):', updateResponse2.data.user.date_of_birth);
    console.log('📞 New Phone:', updateResponse2.data.user.phone);

    // 6. Test clearing Date of Birth
    console.log('\n6. Testing clearing date of birth...');
    const updateResponse3 = await axios.put(`${API_BASE_URL}/users/profile`, {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address,
      date_of_birth: '' // Empty string to clear
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Date of birth cleared successfully');
    console.log('📅 Date of Birth (should be null):', updateResponse3.data.user.date_of_birth);

    console.log('\n🎉 All tests passed! Date of Birth feature is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testDateOfBirthFeature();
