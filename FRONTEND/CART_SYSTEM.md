# Hệ thống Giỏ hàng - TechStore

## Tổng quan

Hệ thống giỏ hàng hoàn chỉnh với 3 bước: **Giỏ hàng** → **Thanh toán** → **Hoàn tất**

## Tính năng chính

### 🛒 Quản lý Giỏ hàng
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Cập nhật số lượng sản phẩm
- ✅ Xóa sản phẩm khỏi giỏ hàng
- ✅ Xóa toàn bộ giỏ hàng
- ✅ Hiển thị số lượng sản phẩm trong header
- ✅ Tính toán tổng tiền tự động

### 💳 Quy trình Thanh toán (3 bước)
1. **Bước 1: Giỏ hàng** - Xem lại sản phẩm, điều chỉnh số lượng
2. **Bước 2: Thanh toán** - Nhập thông tin giao hàng và phương thức thanh toán
3. **Bước 3: Hoàn tất** - Xác nhận đơn hàng thành công

### 🔄 Real-time Updates
- Số lượng giỏ hàng cập nhật ngay lập tức
- Tổng tiền tự động tính toán
- Loading states cho tất cả actions

## API Endpoints

### Cart API
```typescript
// Lấy giỏ hàng
GET /api/cart

// Thêm sản phẩm vào giỏ hàng
POST /api/cart
{
  "product_id": "string",
  "quantity": number
}

// Cập nhật số lượng
PUT /api/cart/:cartItemId
{
  "quantity": number
}

// Xóa sản phẩm
DELETE /api/cart/:cartItemId

// Xóa toàn bộ giỏ hàng
DELETE /api/cart
```

### Order API
```typescript
// Tạo đơn hàng
POST /api/orders
{
  "shipping_recipient_name": "string",
  "shipping_address": "string", 
  "payment_method": "cod" | "bank" | "momo",
  "notes": "string"
}
```

## Components

### 1. CartIcon
```tsx
import { CartIcon } from "@/components/cart-icon"

// Hiển thị icon giỏ hàng với số lượng
<CartIcon />
```

### 2. AddToCartButton
```tsx
import { AddToCartButton } from "@/components/add-to-cart-button"

// Button đơn giản
<AddToCartButton product={product} />

// Button với selector số lượng
<AddToCartButton 
  product={product} 
  showQuantitySelector={true}
  className="w-full"
/>
```

### 3. ProductActions (đã cập nhật)
```tsx
import { ProductActions } from "@/components/product-actions"

// Component đầy đủ cho trang chi tiết sản phẩm
<ProductActions product={product} />
```

## Hooks

### useCart
```tsx
import { useCart } from "@/hooks/use-cart"

const { data: cartData, isLoading } = useCart()
const cartItems = cartData?.cartItems || []
const totalAmount = cartData?.totalAmount || 0
```

### useAddToCart
```tsx
import { useAddToCart } from "@/hooks/use-cart"

const addToCartMutation = useAddToCart()

await addToCartMutation.mutateAsync({
  product_id: "product_id",
  quantity: 1
})
```

### useCartCount
```tsx
import { useCartCount } from "@/hooks/use-cart"

const cartCount = useCartCount() // Số lượng sản phẩm trong giỏ
```

## Pages

### 1. Cart Page (`/cart`)
- Quy trình 3 bước hoàn chỉnh
- Quản lý giỏ hàng
- Form thông tin giao hàng
- Xác nhận đơn hàng

### 2. Test Cart Page (`/test-cart`)
- Trang demo để test chức năng
- Hiển thị sản phẩm với nút thêm vào giỏ
- Selector số lượng

## Cách sử dụng

### 1. Thêm sản phẩm vào giỏ hàng
```tsx
// Trong component sản phẩm
<AddToCartButton 
  product={product}
  showQuantitySelector={true}
/>
```

### 2. Hiển thị số lượng giỏ hàng
```tsx
// Trong header
<CartIcon />
```

### 3. Trang giỏ hàng
```tsx
// Điều hướng đến /cart
<Link href="/cart">Xem giỏ hàng</Link>
```

## Error Handling

- ✅ Validation form thông tin giao hàng
- ✅ Kiểm tra tồn kho trước khi thêm
- ✅ Toast notifications cho tất cả actions
- ✅ Loading states và disabled buttons
- ✅ Retry mechanisms

## Security

- ✅ Authentication required cho tất cả cart operations
- ✅ User chỉ có thể truy cập giỏ hàng của mình
- ✅ Validation server-side cho tất cả inputs
- ✅ CSRF protection với cookies

## Testing

Truy cập `/test-cart` để test các chức năng:
1. Thêm sản phẩm vào giỏ hàng
2. Xem số lượng cập nhật trong header
3. Truy cập `/cart` để test quy trình thanh toán

## Next Steps

- [ ] Thêm wishlist functionality
- [ ] Payment gateway integration
- [ ] Order tracking
- [ ] Email notifications
- [ ] Inventory management
- [ ] Discount codes/coupons
