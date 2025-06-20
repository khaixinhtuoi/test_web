"use client"

import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { type Product } from "@/lib/api"

interface ProductInfoProps {
  product: Product
  className?: string
}

export function ProductInfo({ product, className = "" }: ProductInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫"
  }

  // Tạo rating giả lập dựa trên tên sản phẩm
  const rating = 4.0 + (product.product_name.length % 10) / 10
  const reviews = 50 + (product.product_name.length % 100)

  // Tính giá gốc và discount giả lập
  const originalPrice = Math.round(product.price * 1.15)
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Product Title */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">{product.product_name}</h1>
        
        {/* Rating and Info */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-current" : ""}`} />
              ))}
            </div>
            <span className="text-gray-400 ml-2">({reviews} đánh giá)</span>
          </div>
          
          {product.brand && (
            <span className="text-gray-400">Thương hiệu: {product.brand}</span>
          )}
          
          <Badge className={product.stock_quantity > 0 ? "bg-green-600" : "bg-red-600"}>
            {product.stock_quantity > 0 ? "Còn hàng" : "Hết hàng"}
          </Badge>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-yellow-400">{formatPrice(product.price)}</span>
        {discountPercent > 0 && (
          <>
            <span className="text-xl text-gray-400 line-through ml-4">{formatPrice(originalPrice)}</span>
            <Badge className="bg-red-600 ml-2">-{discountPercent}%</Badge>
          </>
        )}
      </div>

      {/* Description */}
      <div className="mb-8">
        <p className="text-gray-300 leading-relaxed">
          {product.description || "Sản phẩm chất lượng cao với thiết kế hiện đại và tính năng vượt trội."}
        </p>
      </div>

      {/* Stock Warning */}
      {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
        <div className="p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ Chỉ còn {product.stock_quantity} sản phẩm trong kho
          </p>
        </div>
      )}

      {/* Category Info */}
      {product.category_id && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Thông tin sản phẩm</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Danh mục:</span>
              <span className="text-white">{product.category_id.category_name}</span>
            </div>
            {product.brand && (
              <div className="flex justify-between">
                <span className="text-gray-400">Thương hiệu:</span>
                <span className="text-white">{product.brand}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Tình trạng:</span>
              <span className={product.stock_quantity > 0 ? "text-green-400" : "text-red-400"}>
                {product.stock_quantity > 0 ? `Còn ${product.stock_quantity} sản phẩm` : "Hết hàng"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white font-semibold mb-3">Thông số kỹ thuật</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(product.specifications).slice(0, 5).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                <span className="text-white">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
