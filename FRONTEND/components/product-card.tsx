import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { type Product } from "@/lib/api"

interface ProductCardProps {
  product: Product
  showDiscount?: boolean
  className?: string
}

export function ProductCard({ product, showDiscount = true, className = "" }: ProductCardProps) {
  // Tính toán giá gốc và discount (giả lập)
  const originalPrice = Math.round(product.price * 1.15) // Giả sử giá gốc cao hơn 15%
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100)
  
  // Tạo rating giả lập dựa trên tên sản phẩm
  const rating = 4.0 + (product.product_name.length % 10) / 10
  const reviews = 50 + (product.product_name.length % 100)

  // Xác định badge dựa trên stock và tên sản phẩm
  const getBadge = () => {
    if (product.stock_quantity === 0) return { text: "Hết hàng", color: "bg-red-500" }
    if (product.stock_quantity <= 5) return { text: "Sắp hết", color: "bg-yellow-500" }
    if (product.product_name.toLowerCase().includes("pro")) return { text: "Pro", color: "bg-purple-500" }
    if (product.product_name.toLowerCase().includes("new") || product.product_name.includes("16")) return { text: "Mới", color: "bg-green-500" }
    if (discountPercent > 10) return { text: "Hot", color: "bg-red-500" }
    return { text: "Bán chạy", color: "bg-blue-500" }
  }

  const badge = getBadge()

  // Định dạng giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫"
  }

  return (
    <Link href={`/product/${product._id}`}>
      <Card className={`bg-gray-800 border-gray-700 hover:border-yellow-600 transition-all hover:translate-y-[-8px] cursor-pointer rounded-xl overflow-hidden group ${className}`}>
        <CardContent className="p-4">
          <div className="relative mb-4 bg-gray-700 rounded-lg p-4">
            <Image
              src={product.image_url || "/placeholder.svg?height=300&width=300"}
              alt={product.product_name}
              width={300}
              height={300}
              className="w-full h-48 object-contain group-hover:scale-105 transition-transform"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=300&width=300"
              }}
            />
            <Badge className={`absolute top-2 left-2 ${badge.color} text-white font-medium rounded-full px-2.5`}>
              {badge.text}
            </Badge>
            {showDiscount && discountPercent > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-600 rounded-full px-2.5">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
            {product.product_name}
          </h3>

          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-current" : ""}`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm ml-2">({reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-yellow-400 font-bold text-lg">{formatPrice(product.price)}</span>
              {showDiscount && discountPercent > 0 && (
                <span className="text-gray-400 text-sm line-through ml-2">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {product.brand && (
            <div className="mt-2">
              <span className="text-gray-400 text-xs">Thương hiệu: {product.brand}</span>
            </div>
          )}

          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <div className="mt-2">
              <span className="text-yellow-500 text-xs">Chỉ còn {product.stock_quantity} sản phẩm</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
