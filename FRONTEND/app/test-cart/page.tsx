"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { usePublicProducts } from "@/hooks/use-public-api"
import { Skeleton } from "@/components/ui/skeleton"
import { DebugCart } from "@/components/debug-cart"
import Image from "next/image"

export default function TestCartPage() {
  const { data: productsData, isLoading } = usePublicProducts({ limit: 6 })
  const products = productsData?.products || []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Test Giỏ Hàng</h1>
          <p className="text-gray-400">Thử nghiệm chức năng thêm sản phẩm vào giỏ hàng</p>
        </div>

        {/* Debug Component */}
        <DebugCart />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <Skeleton className="w-full h-48 bg-gray-700 mb-4" />
                  <Skeleton className="h-4 w-3/4 bg-gray-700 mb-2" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700 mb-4" />
                  <Skeleton className="h-10 w-full bg-gray-700" />
                </CardContent>
              </Card>
            ))
          ) : (
            products.map((product) => (
              <Card key={product._id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-4">
                  <div className="relative mb-4 bg-gray-700 rounded-lg p-4">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.product_name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <h3 className="font-semibold text-white line-clamp-2">
                      {product.product_name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {product.category_id.category_name}
                      {product.brand && ` • ${product.brand}`}
                    </p>
                    <p className="text-yellow-400 font-bold text-lg">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Còn lại: {product.stock_quantity} sản phẩm
                    </p>
                  </div>

                  <AddToCartButton
                    product={product}
                    showQuantitySelector={true}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {!isLoading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Không có sản phẩm nào để hiển thị</p>
          </div>
        )}
      </div>
    </div>
  )
}
