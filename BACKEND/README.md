# E-commerce API

API backend cho ứng dụng e-commerce được xây dựng bằng Node.js, Express và MongoDB.

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:
```
npm install
```
3. Tạo file .env từ file .env.example và cấu hình các biến môi trường:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```
4. Khởi động server:
```
npm run dev
```

## Cấu trúc dự án

```
src/
├── controllers/    # Xử lý logic nghiệp vụ
├── middlewares/    # Middleware xác thực và xử lý lỗi
├── models/         # Định nghĩa schema MongoDB
├── routes/         # Định nghĩa API endpoints
├── utils/          # Các tiện ích
└── index.js        # Entry point
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Đăng ký người dùng mới
- `POST /api/users/login` - Đăng nhập và nhận JWT token
- `/api/auth/logout` - Đăng xuất

### Users

- `GET /api/users/profile` - Lấy thông tin người dùng hiện tại
- `PUT /api/users/profile` - Cập nhật thông tin người dùng
- `PUT /api/users/change-password` - Đổi mật khẩu

### Categories

- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:categoryId` - Lấy thông tin danh mục theo ID

### Products

- `GET /api/products` - Lấy danh sách sản phẩm (có phân trang và lọc)
- `GET /api/products/:productId` - Lấy thông tin sản phẩm theo ID

### Cart

- `GET /api/cart` - Lấy giỏ hàng của người dùng
- `POST /api/cart` - Thêm sản phẩm vào giỏ hàng
- `PUT /api/cart/:cartItemId` - Cập nhật số lượng sản phẩm trong giỏ hàng
- `DELETE /api/cart/:cartItemId` - Xóa sản phẩm khỏi giỏ hàng
- `DELETE /api/cart` - Xóa toàn bộ giỏ hàng

### Orders

- `POST /api/orders` - Tạo đơn hàng mới từ giỏ hàng
- `GET /api/orders/my-orders` - Lấy danh sách đơn hàng của người dùng
- `GET /api/orders/my-orders/:orderId` - Lấy thông tin chi tiết đơn hàng
- `PUT /api/orders/my-orders/:orderId/cancel` - Hủy đơn hàng

### Admin Routes

- `GET /api/users` - Lấy danh sách người dùng
- `PUT /api/users/:userId/status` - Cập nhật trạng thái người dùng
- `GET /api/categories/admin/all` - Lấy danh sách tất cả danh mục
- `POST /api/categories` - Tạo danh mục mới
- `PUT /api/categories/:categoryId` - Cập nhật thông tin danh mục
- `PUT /api/categories/:categoryId/status` - Cập nhật trạng thái danh mục
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:productId` - Cập nhật thông tin sản phẩm
- `PUT /api/products/:productId/status` - Cập nhật trạng thái sản phẩm
- `PUT /api/products/:productId/stock` - Cập nhật số lượng tồn kho
- `GET /api/orders` - Lấy danh sách tất cả đơn hàng
- `PUT /api/orders/:orderId/status` - Cập nhật trạng thái đơn hàng 