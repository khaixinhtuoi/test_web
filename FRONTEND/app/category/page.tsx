"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search, Grid, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePublicCategories, usePublicProducts } from "@/hooks/use-public-api"

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Lấy dữ liệu từ API
  const { data: categoriesData, isLoading: categoriesLoading } = usePublicCategories()
  const { data: allProductsData } = usePublicProducts({ limit: 1000 })

  const categories = categoriesData?.categories || []
  const allProducts = allProductsData?.products || []

  // Lọc categories theo search term
  const filteredCategories = categories.filter(category =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Tính số lượng sản phẩm cho mỗi category
  const getCategoryProductCount = (categoryId: string) => {
    return allProducts.filter(product => product.category_id._id === categoryId).length
  }

  // Lấy sản phẩm mẫu cho mỗi category
  const getCategoryProducts = (categoryId: string, limit = 3) => {
    return allProducts
      .filter(product => product.category_id._id === categoryId)
      .slice(0, limit)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫"
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-yellow-400">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-white">Danh mục sản phẩm</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Danh mục sản phẩm</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Khám phá các danh mục sản phẩm đa dạng với hàng ngàn sản phẩm chất lượng cao
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              className="bg-gray-800 border-gray-700 text-white pl-12 h-12 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* All Products Card */}
        <div className="mb-12">
          <Link href="/products">
            <Card className="bg-gradient-to-r from-yellow-600 to-orange-500 border-yellow-500 hover:from-yellow-500 hover:to-orange-400 transition-all hover:translate-y-[-4px] cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Grid className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Xem tất cả sản phẩm
                </h3>
                <p className="text-white/80 mb-4">
                  Khám phá toàn bộ bộ sưu tập sản phẩm của chúng tôi
                </p>
                <Badge className="bg-white text-yellow-600 font-medium">
                  {allProducts.length} sản phẩm
                </Badge>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Categories Grid */}
        {categoriesLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <Skeleton className="w-full h-48 mb-4 bg-gray-700" />
                  <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 mb-4 bg-gray-700" />
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 bg-gray-700" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category) => {
              const productCount = getCategoryProductCount(category._id)
              const sampleProducts = getCategoryProducts(category._id, 3)
              
              return (
                <Link key={category._id} href={`/category/${category._id}`}>
                  <Card className="bg-gray-800 border-gray-700 hover:border-yellow-600 transition-all hover:translate-y-[-4px] cursor-pointer group">
                    <CardContent className="p-6">
                      {/* Category Header */}
                      <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Package className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                          {category.category_name}
                        </h3>
                        <Badge className="bg-yellow-600 text-black">
                          {productCount} sản phẩm
                        </Badge>
                      </div>

                      {/* Sample Products */}
                      {sampleProducts.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-3">Sản phẩm nổi bật:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {sampleProducts.map((product) => (
                              <div key={product._id} className="bg-gray-700 rounded-lg p-2 text-center">
                                <Image
                                  src={product.image_url || "/placeholder.svg"}
                                  alt={product.product_name}
                                  width={60}
                                  height={60}
                                  className="w-full h-12 object-contain mb-1"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.svg?height=60&width=60"
                                  }}
                                />
                                <p className="text-xs text-gray-300 truncate">{product.product_name}</p>
                                <p className="text-xs text-yellow-400 font-medium">{formatPrice(product.price)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* View All Button */}
                      <div className="mt-6 text-center">
                        <Button 
                          className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium w-full group-hover:bg-yellow-500 transition-colors"
                        >
                          <Grid className="h-4 w-4 mr-2" />
                          Xem tất cả sản phẩm
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {searchTerm ? "Không tìm thấy danh mục nào" : "Chưa có danh mục nào"}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Danh mục sẽ được cập nhật sớm"}
            </p>
          </div>
        )}

        {/* Quick Links */}
        {!searchTerm && filteredCategories.length > 0 && (
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-white mb-8">Hoặc xem tất cả sản phẩm</h2>
            <Link href="/products">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium px-8 py-3 text-lg">
                <Package className="h-5 w-5 mr-2" />
                Xem tất cả sản phẩm
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
