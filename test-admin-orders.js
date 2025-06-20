const axios = require('axios');

// Test admin orders API
async function testAdminOrders() {
  try {
    // Đăng nhập để lấy token
    console.log('=== ĐĂNG NHẬP ===');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'vugiakhai2004@gmail.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.accessToken;
    console.log('Token:', token ? 'OK' : 'FAILED');
    
    // Test admin orders API
    console.log('\n=== TEST ADMIN ORDERS API ===');
    const ordersResponse = await axios.get('http://localhost:5000/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Orders response status:', ordersResponse.status);
    console.log('Orders count:', ordersResponse.data.orders?.length || 0);
    console.log('Total orders:', ordersResponse.data.pagination?.total || 0);
    
    if (ordersResponse.data.orders?.length > 0) {
      console.log('First order:', ordersResponse.data.orders[0]);
    }
    
  } catch (error) {
    console.error('=== LỖI ===');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Error:', error.response?.data?.error);
    console.error('Full error:', error.message);
  }
}

testAdminOrders();
