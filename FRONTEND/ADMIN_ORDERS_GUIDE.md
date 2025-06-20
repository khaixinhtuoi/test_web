# Hướng dẫn Admin Orders - TechStore

## 🎯 Tổng quan

Trang quản lý đơn hàng admin đã được cập nhật để sử dụng dữ liệu thật từ API backend thay vì dữ liệu mẫu.

## ✨ Tính năng đã triển khai

### 📊 **Dashboard & Statistics**
- ✅ Thống kê tổng quan: Tổng đơn hàng, đang xử lý, đã giao hàng, doanh thu
- ✅ Real-time data từ API
- ✅ Cards hiển thị số liệu quan trọng

### 🔍 **Tìm kiếm & Lọc**
- ✅ Tìm kiếm theo mã đơn hàng, tên khách hàng, email
- ✅ Lọc theo trạng thái đơn hàng (pending, confirmed, shipping, delivered, cancelled)
- ✅ Lọc theo trạng thái thanh toán (pending, paid, failed)
- ✅ Pagination với điều hướng trang

### 📋 **Danh sách đơn hàng**
- ✅ Hiển thị thông tin đầy đủ: mã đơn, khách hàng, ngày tạo, tổng tiền
- ✅ Badge trạng thái với màu sắc phù hợp
- ✅ Loading states và error handling
- ✅ Empty states khi không có dữ liệu

### 👁️ **Xem chi tiết đơn hàng**
- ✅ Thông tin đơn hàng: mã, ngày, trạng thái, phương thức thanh toán
- ✅ Thông tin khách hàng: tên, email
- ✅ Địa chỉ giao hàng và ghi chú
- ✅ Chi tiết sản phẩm: tên, số lượng, đơn giá, thành tiền
- ✅ Tính toán: tạm tính, phí vận chuyển, tổng tiền

### ✏️ **Chỉnh sửa đơn hàng**
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Cập nhật trạng thái thanh toán
- ✅ Loading states khi đang lưu
- ✅ Toast notifications cho feedback

## 🔧 API Endpoints

### Admin Orders API
```typescript
// Lấy danh sách đơn hàng (admin)
GET /api/admin/orders?page=1&limit=10&status=pending

// Lấy chi tiết đơn hàng (admin)
GET /api/admin/orders/:orderId

// Cập nhật trạng thái đơn hàng (admin)
PUT /api/admin/orders/:orderId/status
{
  "order_status": "confirmed",
  "payment_status": "paid"
}
```

## 📱 Components & Hooks

### Hooks
- `useAdminOrders(filters)` - Lấy danh sách đơn hàng
- `useAdminOrderDetails(orderId)` - Lấy chi tiết đơn hàng
- `useUpdateOrderStatus()` - Cập nhật trạng thái
- `useOrderStats()` - Thống kê đơn hàng

### Types
```typescript
interface AdminOrder {
  _id: string;
  user_id: { email: string; first_name?: string; last_name?: string };
  order_number: string;
  order_status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  total_amount: number;
  created_at: string;
  // ... other fields
}
```

## 🎨 UI/UX Features

### Loading States
- ✅ Skeleton loading cho danh sách
- ✅ Spinner loading cho chi tiết
- ✅ Button loading states

### Error Handling
- ✅ Error page với retry button
- ✅ Toast notifications
- ✅ 401/403 handling

### Responsive Design
- ✅ Mobile-friendly layout
- ✅ Responsive tables
- ✅ Modal dialogs

## 🚀 Cách sử dụng

### 1. Truy cập trang Admin Orders
```
http://localhost:3000/admin/orders
```

### 2. Xem thống kê
- Dashboard hiển thị tổng quan đơn hàng
- Số liệu real-time từ database

### 3. Tìm kiếm & Lọc
- Nhập từ khóa vào ô tìm kiếm
- Chọn trạng thái từ dropdown
- Kết quả tự động cập nhật

### 4. Xem chi tiết đơn hàng
- Click nút "👁️" để xem chi tiết
- Modal hiển thị thông tin đầy đủ

### 5. Chỉnh sửa đơn hàng
- Click nút "✏️" để chỉnh sửa
- Cập nhật trạng thái đơn hàng/thanh toán
- Click "Lưu thay đổi"

## 🔐 Phân quyền

### Admin Required
- Tất cả tính năng yêu cầu quyền admin
- Middleware `authMiddleware.admin` kiểm tra quyền
- Redirect về login nếu không có quyền

### Authentication
- JWT token trong localStorage
- Auto refresh khi token hết hạn
- Error handling cho 401/403

## 📊 Status Mapping

### Order Status
- `pending` → "Đang xử lý" (Yellow)
- `confirmed` → "Đã xác nhận" (Purple)
- `shipping` → "Đang giao hàng" (Blue)
- `delivered` → "Đã giao hàng" (Green)
- `cancelled` → "Đã hủy" (Red)

### Payment Status
- `pending` → "Chưa thanh toán" (Yellow)
- `paid` → "Đã thanh toán" (Green)
- `failed` → "Thanh toán thất bại" (Red)

## 🐛 Troubleshooting

### Không hiển thị đơn hàng
1. Kiểm tra đăng nhập admin
2. Kiểm tra API backend đang chạy
3. Xem Network tab trong DevTools

### Lỗi 403 Forbidden
1. Đảm bảo user có quyền admin
2. Kiểm tra JWT token
3. Đăng nhập lại

### Loading mãi không xong
1. Kiểm tra kết nối mạng
2. Restart backend server
3. Clear browser cache

## 🔄 Next Steps

- [ ] Export đơn hàng ra Excel/PDF
- [ ] Bulk actions (cập nhật nhiều đơn cùng lúc)
- [ ] Order tracking integration
- [ ] Email notifications
- [ ] Advanced filtering (date range, amount range)
- [ ] Order analytics & reports
