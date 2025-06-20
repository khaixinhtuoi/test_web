"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2, Plus, Minus } from "lucide-react"
import { useAddToCart } from "@/hooks/use-cart"
import { type Product } from "@/lib/api"

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  showQuantitySelector?: boolean
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function AddToCartButton({ 
  product, 
  quantity: initialQuantity = 1,
  showQuantitySelector = false,
  className = "",
  size = "default",
  variant = "default"
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(initialQuantity)
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

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(prev => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const isOutOfStock = product.stock_quantity === 0
  const isLoading = addToCartMutation.isPending

  if (showQuantitySelector) {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Quantity Selector */}
        <div className="flex items-center space-x-3">
          <span className="text-gray-300 text-sm">Số lượng:</span>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || isLoading}
              className="h-8 w-8 p-0 border-gray-600 text-gray-300"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-white font-medium">{quantity}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={incrementQuantity}
              disabled={quantity >= product.stock_quantity || isLoading}
              className="h-8 w-8 p-0 border-gray-600 text-gray-300"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-gray-400 text-sm">
            ({product.stock_quantity} có sẵn)
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
          size={size}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang thêm...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isOutOfStock || isLoading}
      className={className}
      size={size}
      variant={variant}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4 mr-2" />
      )}
      {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
    </Button>
  )
}
