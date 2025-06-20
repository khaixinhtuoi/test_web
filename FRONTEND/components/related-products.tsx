"use client"

import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { usePublicProducts } from "@/hooks/use-public-api"
import { type Product } from "@/lib/api"

interface RelatedProductsProps {
  currentProduct: Product
  className?: string
}

export function RelatedProducts({ currentProduct, className = "" }: RelatedProductsProps) {
  // Lấy sản phẩm cùng category
  const { data: categoryProductsData, isLoading: categoryLoading } = usePublicProducts({
    category: currentProduct.category_id?._id,
    limit: 8,
  })

  // Lấy sản phẩm cùng brand (nếu có)
  const { data: brandProductsData, isLoading: brandLoading } = usePublicProducts({
    brands: currentProduct.brand ? [currentProduct.brand] : undefined,
    limit: 8,
  })

  const categoryProducts = categoryProductsData?.products?.filter(p => p._id !== currentProduct._id) || []
  const brandProducts = brandProductsData?.products?.filter(p => p._id !== currentProduct._id) || []

  // Kết hợp và loại bỏ trùng lặp
  const allRelatedProducts = [
    ...categoryProducts,
    ...brandProducts.filter(bp => !categoryProducts.some(cp => cp._id === bp._id))
  ].slice(0, 8)

  const isLoading = categoryLoading || brandLoading

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <h2 className="text-2xl font-bold text-white">Sản phẩm liên quan</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <Skeleton className="w-full h-48 mb-4 bg-gray-700" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
                <Skeleton className="h-6 w-24 bg-gray-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (allRelatedProducts.length === 0) {
    return null
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Sản phẩm liên quan</h2>
        {currentProduct.category_id && (
          <p className="text-gray-400 text-sm">
            Cùng danh mục: {currentProduct.category_id.category_name}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allRelatedProducts.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Show more products if available */}
      {allRelatedProducts.length > 4 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Sản phẩm khác</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allRelatedProducts.slice(4, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Category and Brand info */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-700">
        {currentProduct.category_id && (
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400 text-sm">Danh mục: </span>
            <span className="text-yellow-400 text-sm font-medium">
              {currentProduct.category_id.category_name}
            </span>
          </div>
        )}
        {currentProduct.brand && (
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400 text-sm">Thương hiệu: </span>
            <span className="text-yellow-400 text-sm font-medium">
              {currentProduct.brand}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
