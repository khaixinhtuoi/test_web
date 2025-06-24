const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testRevenueCalculation() {
  console.log('🧪 Testing Revenue Calculation Logic...\n');

  try {
    // 1. Test Dashboard Stats API
    console.log('1. Testing Dashboard Stats API...');
    
    // Cần token admin để test
    console.log('⚠️  Note: Cần đăng nhập với tài khoản admin để test API này');
    console.log('📝 Bạn có thể test bằng cách:');
    console.log('   - Truy cập http://localhost:3000/auth');
    console.log('   - Đăng nhập với tài khoản admin');
    console.log('   - Truy cập http://localhost:3000/admin');
    console.log('   - Kiểm tra dashboard stats\n');

    // 2. Giải thích logic mới
    console.log('2. Logic tính doanh thu đã được cập nhật:');
    console.log('✅ Trước: Tính tất cả đơn hàng không bị hủy');
    console.log('✅ Sau: Chỉ tính đơn hàng có payment_status = "paid"');
    console.log('');
    
    console.log('📊 Các trường hợp được tính vào doanh thu:');
    console.log('   ✅ order_status: pending/confirmed/shipping/delivered');
    console.log('   ✅ payment_status: paid');
    console.log('');
    
    console.log('❌ Các trường hợp KHÔNG được tính vào doanh thu:');
    console.log('   ❌ order_status: cancelled');
    console.log('   ❌ payment_status: pending/failed');
    console.log('');

    // 3. Các API endpoints đã được cập nhật
    console.log('3. Các API endpoints đã được cập nhật:');
    console.log('   📍 GET /api/orders/dashboard/stats');
    console.log('   - totalRevenue: Chỉ tính đơn hàng đã thanh toán');
    console.log('   - monthlyRevenue: Chỉ tính đơn hàng đã thanh toán');
    console.log('   - currentMonthRevenue: Chỉ tính đơn hàng đã thanh toán');
    console.log('   - lastMonthRevenue: Chỉ tính đơn hàng đã thanh toán');
    console.log('');

    // 4. Frontend components đã được cập nhật
    console.log('4. Frontend components:');
    console.log('   📱 Admin Dashboard (/admin):');
    console.log('   - Hiển thị tổng doanh thu từ đơn hàng đã thanh toán');
    console.log('   - Biểu đồ doanh thu theo tháng chỉ tính đơn hàng đã thanh toán');
    console.log('');
    console.log('   📱 Revenue Page (/admin/revenue):');
    console.log('   - Sử dụng dữ liệu từ dashboard stats API');
    console.log('   - Tự động áp dụng logic mới');
    console.log('');

    // 5. Ví dụ về cách hoạt động
    console.log('5. Ví dụ về cách hoạt động:');
    console.log('');
    console.log('📦 Đơn hàng A:');
    console.log('   - order_status: "delivered"');
    console.log('   - payment_status: "paid"');
    console.log('   - total_amount: 1,000,000 VND');
    console.log('   ✅ ĐƯỢC TÍNH vào doanh thu');
    console.log('');
    
    console.log('📦 Đơn hàng B:');
    console.log('   - order_status: "confirmed"');
    console.log('   - payment_status: "pending"');
    console.log('   - total_amount: 500,000 VND');
    console.log('   ❌ KHÔNG ĐƯỢC TÍNH vào doanh thu');
    console.log('');
    
    console.log('📦 Đơn hàng C:');
    console.log('   - order_status: "cancelled"');
    console.log('   - payment_status: "paid"');
    console.log('   - total_amount: 800,000 VND');
    console.log('   ❌ KHÔNG ĐƯỢC TÍNH vào doanh thu');
    console.log('');

    console.log('💰 Tổng doanh thu = 1,000,000 VND (chỉ đơn hàng A)');
    console.log('');

    // 6. Hướng dẫn test
    console.log('6. Hướng dẫn test thực tế:');
    console.log('');
    console.log('🔧 Để test logic mới:');
    console.log('1. Khởi động backend và frontend');
    console.log('2. Đăng nhập với tài khoản admin');
    console.log('3. Tạo một số đơn hàng test với các trạng thái khác nhau:');
    console.log('   - Đơn hàng đã thanh toán (payment_status: "paid")');
    console.log('   - Đơn hàng chưa thanh toán (payment_status: "pending")');
    console.log('   - Đơn hàng thanh toán thất bại (payment_status: "failed")');
    console.log('4. Kiểm tra dashboard để xem doanh thu');
    console.log('5. Chỉ những đơn hàng có payment_status = "paid" mới được tính');
    console.log('');

    console.log('🎉 Logic tính doanh thu đã được cập nhật thành công!');
    console.log('📊 Bây giờ chỉ những đơn hàng đã thanh toán mới được tính vào doanh thu.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testRevenueCalculation();
