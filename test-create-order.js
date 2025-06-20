const axios = require('axios');

// Test tạo đơn hàng
async function testCreateOrder() {
  try {
    // Đăng nhập để lấy token
    console.log('=== ĐĂNG NHẬP ===');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'vugiakhai2004@gmail.com',
      password: 'password123' // Thay bằng mật khẩu thực tế
    });
    
    const token = loginResponse.data.accessToken;
    console.log('Token:', token ? 'OK' : 'FAILED');
    
    // Kiểm tra giỏ hàng
    console.log('\n=== KIỂM TRA GIỎ HÀNG ===');
    const cartResponse = await axios.get('http://localhost:5000/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Cart items:', cartResponse.data.cartItems.length);
    console.log('Total amount:', cartResponse.data.totalAmount);
    
    if (cartResponse.data.cartItems.length === 0) {
      console.log('Giỏ hàng trống, không thể test tạo đơn hàng');
      return;
    }
    
    // Tạo đơn hàng
    console.log('\n=== TẠO ĐƠN HÀNG ===');
    const orderData = {
      shipping_recipient_name: 'Test User',
      shipping_address: '123 Test Street, Test City',
      payment_method: 'cod',
      notes: 'Test order'
    };
    
    console.log('Order data:', orderData);
    
    const orderResponse = await axios.post('http://localhost:5000/api/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Order created successfully!');
    console.log('Order ID:', orderResponse.data.order._id);
    console.log('Order number:', orderResponse.data.order.order_number);
    
  } catch (error) {
    console.error('=== LỖI ===');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Error:', error.response?.data?.error);
    console.error('Full error:', error.message);
  }
}

testCreateOrder();
