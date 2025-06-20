"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Minus, Plus, ShoppingCart, CreditCard, Truck, Shield, RotateCcw, Loader2 } from "lucide-react"
import { type Product } from "@/lib/api"
import { toast } from "sonner"
import { useAddToCart } from "@/hooks/use-cart"

interface ProductActionsProps {
  product: Product
  className?: string
}

export function ProductActions({ product, className = "" }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const addToCartMutation = useAddToCart()

  const handleAddToCart = async () => {
    if (product.stock_quantity === 0) return

    try {
      await addToCartMutation.mutateAsync({
        product_id: product._id,
        quantity: quantity
      })
    } catch (error) {
      // Error được xử lý trong hook
    }
  }

  const handleBuyNow = () => {
    if (product.stock_quantity === 0) return
    toast.success("Chuyển đến trang thanh toán")
    // Redirect to checkout
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích")
  }

  const maxQuantity = Math.min(product.stock_quantity, 10) // Giới hạn tối đa 10

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quantity Selector */}
      <div>
        <h3 className="text-white font-semibold mb-3">Số lượng</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-800 rounded-full">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-white hover:bg-gray-700 rounded-full"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 text-white font-medium min-w-[3rem] text-center">{quantity}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              className="text-white hover:bg-gray-700 rounded-full"
              disabled={quantity >= maxQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-gray-400 text-sm">
            {product.stock_quantity > 0 ? `Còn ${product.stock_quantity} sản phẩm` : "Hết hàng"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex space-x-3">
          <Button
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold disabled:bg-gray-600 disabled:text-gray-400"
            disabled={product.stock_quantity === 0 || addToCartMutation.isPending}
            onClick={handleAddToCart}
          >
            {addToCartMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang thêm...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock_quantity === 0 ? "Hết hàng" : "Thêm vào giỏ"}
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleWishlist}
            className={`border-gray-600 ${isWishlisted ? "text-red-400 border-red-400" : "text-gray-400"}`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>
        </div>

        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold disabled:bg-gray-600 disabled:text-gray-400"
          disabled={product.stock_quantity === 0}
          onClick={handleBuyNow}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {product.stock_quantity === 0 ? "Hết hàng" : "Mua ngay"}
        </Button>
      </div>

      {/* Features */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center text-gray-300">
          <Truck className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
          <span className="text-sm">Giao hàng miễn phí cho đơn hàng từ 2 triệu đồng</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Shield className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
          <span className="text-sm">Bảo hành chính hãng 12 tháng</span>
        </div>
        <div className="flex items-center text-gray-300">
          <RotateCcw className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
          <span className="text-sm">Đổi trả trong vòng 15 ngày</span>
        </div>
        <div className="flex items-center text-gray-300">
          <CreditCard className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
          <span className="text-sm">Trả góp 0% lãi suất</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <Shield className="h-6 w-6 text-green-400 mx-auto mb-1" />
          <span className="text-xs text-gray-300">Chính hãng 100%</span>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <Truck className="h-6 w-6 text-blue-400 mx-auto mb-1" />
          <span className="text-xs text-gray-300">Giao hàng nhanh</span>
        </div>
      </div>
    </div>
  )
}
