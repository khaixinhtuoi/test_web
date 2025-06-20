const axios = require('axios');

// Test API tạo đơn hàng
async function testCreateOrder() {
  try {
    // Đầu tiên đăng nhập để lấy token
    console.log('1. Đăng nhập...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'vugiakhai2004@gmail.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.accessToken;
    console.log('✅ Đăng nhập thành công, token:', token.substring(0, 20) + '...');
    
    // Tạo axios instance với token
    const api = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Kiểm tra giỏ hàng
    console.log('\n2. Kiểm tra giỏ hàng...');
    try {
      const cartResponse = await api.get('/cart');
      console.log('✅ Giỏ hàng:', cartResponse.data);
      
      if (cartResponse.data.cartItems.length === 0) {
        console.log('⚠️ Giỏ hàng trống, thêm sản phẩm...');
        
        // Lấy danh sách sản phẩm
        const productsResponse = await api.get('/products?limit=1');
        if (productsResponse.data.products.length > 0) {
          const product = productsResponse.data.products[0];
          
          // Thêm sản phẩm vào giỏ hàng
          await api.post('/cart', {
            product_id: product._id,
            quantity: 2
          });
          console.log('✅ Đã thêm sản phẩm vào giỏ hàng');
        }
      }
    } catch (error) {
      console.log('❌ Lỗi khi kiểm tra giỏ hàng:', error.response?.data || error.message);
    }
    
    // Tạo đơn hàng
    console.log('\n3. Tạo đơn hàng...');
    const orderData = {
      shipping_recipient_name: 'Nguyễn Văn Test',
      shipping_address: '123 Đường Test, Quận 1, TP.HCM',
      payment_method: 'cod',
      notes: 'Test order từ script'
    };
    
    const orderResponse = await api.post('/orders', orderData);
    console.log('✅ Tạo đơn hàng thành công:', orderResponse.data);
    
    // Kiểm tra đơn hàng trong admin
    console.log('\n4. Kiểm tra đơn hàng trong admin...');
    const adminOrdersResponse = await api.get('/admin/orders');
    console.log('✅ Danh sách đơn hàng admin:', adminOrdersResponse.data);
    
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// Chạy test
testCreateOrder();
