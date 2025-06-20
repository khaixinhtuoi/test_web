# Hướng dẫn Test Hệ thống Giỏ hàng

## 🔧 Các lỗi đã fix

### 1. **Import thiếu Loader2**
- ✅ Đã thêm `Loader2` vào import trong `ProductActions`

### 2. **Backend API Response**
- ✅ Đã sửa backend trả về `totalItems` thay vì chỉ `itemCount`
- ✅ `totalItems` = tổng số lượng sản phẩm (quantity)
- ✅ `itemCount` = số loại sản phẩm khác nhau

### 3. **Authentication Handling**
- ✅ Đã thêm check authentication trước khi gọi cart API
- ✅ Hiển thị thông báo yêu cầu đăng nhập
- ✅ Auto redirect đến `/auth` nếu chưa đăng nhập

### 4. **Client-side Hydration**
- ✅ Đã thêm mounted state để tránh hydration mismatch
- ✅ Cart count chỉ hiển thị sau khi component mount

## 🧪 Cách Test

### Bước 1: Khởi động Backend
```bash
cd test_web/BACKEND
npm run dev
```

### Bước 2: Khởi động Frontend
```bash
cd test_web/FRONTEND
npm run dev
```

### Bước 3: Test Authentication
1. Truy cập `http://localhost:3000/auth`
2. Đăng ký tài khoản mới hoặc đăng nhập
3. Kiểm tra localStorage có `accessToken` và `userData`

### Bước 4: Test Cart Functionality
1. Truy cập `http://localhost:3000/test-cart`
2. Xem **Debug Cart Info** để kiểm tra:
   - ✅ Auth Status: Has Token = ✅
   - ✅ Cart Query Status: Loading = ✅, Error = ✅
   - ✅ Cart Data: hiển thị đúng

### Bước 5: Test Add to Cart
1. Ấn nút "Thêm vào giỏ" trên sản phẩm
2. Kiểm tra:
   - ✅ Toast notification hiển thị
   - ✅ Cart count trong header cập nhật
   - ✅ Debug info cập nhật

### Bước 6: Test Cart Page
1. Ấn vào icon giỏ hàng trong header
2. Truy cập `/cart`
3. Test 3-step process:
   - **Bước 1**: Xem giỏ hàng, điều chỉnh số lượng
   - **Bước 2**: Nhập thông tin giao hàng
   - **Bước 3**: Xác nhận đặt hàng

## 🐛 Debug Tools

### Debug Component
- Thêm `<DebugCart />` vào bất kỳ trang nào
- Hiển thị real-time cart status
- Kiểm tra auth, loading, error states

### Browser DevTools
1. **Network Tab**: Kiểm tra API calls
2. **Console**: Xem error messages
3. **Application > Local Storage**: Kiểm tra tokens

### Common Issues & Solutions

#### ❌ "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng"
**Nguyên nhân**: Chưa đăng nhập hoặc token hết hạn
**Giải pháp**: 
1. Truy cập `/auth` để đăng nhập
2. Kiểm tra localStorage có `accessToken`

#### ❌ Cart count không hiển thị
**Nguyên nhân**: 
- Chưa đăng nhập
- API error
- Component chưa mount

**Giải pháp**:
1. Kiểm tra Debug Component
2. Refresh page
3. Đăng nhập lại

#### ❌ API 401 Unauthorized
**Nguyên nhân**: Token hết hạn hoặc invalid
**Giải pháp**:
1. Xóa localStorage: `localStorage.clear()`
2. Đăng nhập lại

## 📝 Test Checklist

### Authentication
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập thành công
- [ ] Token được lưu trong localStorage
- [ ] Header hiển thị tên user

### Cart Operations
- [ ] Thêm sản phẩm vào giỏ hàng
- [ ] Cart count hiển thị đúng trong header
- [ ] Toast notification hiển thị
- [ ] Cập nhật số lượng sản phẩm
- [ ] Xóa sản phẩm khỏi giỏ hàng

### Cart Page
- [ ] Hiển thị danh sách sản phẩm trong giỏ
- [ ] Tính tổng tiền đúng
- [ ] 3-step checkout process
- [ ] Tạo đơn hàng thành công

### Error Handling
- [ ] Thông báo lỗi khi chưa đăng nhập
- [ ] Redirect đến trang đăng nhập
- [ ] Xử lý lỗi API
- [ ] Loading states

## 🚀 Next Steps

Sau khi test thành công, bạn có thể:
1. Remove Debug Component khỏi production
2. Thêm more products để test
3. Implement payment gateway
4. Add order tracking
5. Email notifications
