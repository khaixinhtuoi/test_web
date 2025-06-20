"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Star, Filter, Grid, List, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePublicProducts, usePublicCategories } from "@/hooks/use-public-api"

// Dynamic import ProductCard to avoid hydration mismatch
const ProductCard = dynamic(() => import("@/components/product-card").then(mod => ({ default: mod.ProductCard })), {
  ssr: false,
  loading: () => (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <Skeleton className="w-full h-48 mb-4 bg-gray-700" />
        <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
        <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
        <Skeleton className="h-4 w-20 mb-2 bg-gray-700" />
        <Skeleton className="h-6 w-24 bg-gray-700" />
      </CardContent>
    </Card>
  )
})

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState("popular")
  const [searchTerm, setSearchTerm] = useState("")

  // Lấy dữ liệu từ API - KHÔNG lọc theo category để hiển thị tất cả sản phẩm
  const { data: categoriesData } = usePublicCategories()
  const { data: productsData, isLoading: productsLoading } = usePublicProducts({
    // Không truyền category để lấy tất cả sản phẩm
    category: selectedCategory && selectedCategory !== "all" ? selectedCategory : undefined, // Chỉ lọc khi user chọn category cụ thể
    min_price: priceRange[0],
    max_price: priceRange[1],
    brands: selectedBrands.length > 0 ? selectedBrands : undefined,
    sort: sortBy as 'price_asc' | 'price_desc' | 'newest',
    search: searchTerm || undefined,
    limit: 20,
  })

  // Lấy tất cả products để có danh sách brands
  const { data: allProductsData } = usePublicProducts({
    limit: 1000,
  })

  const products = productsData?.products || []
  const categories = categoriesData?.categories || []
  const allProducts = allProductsData?.products || []

  // Lấy danh sách brands từ tất cả products
  const brands = Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean)))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫"
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const clearFilters = () => {
    setPriceRange([0, 50000000])
    setSelectedBrands([])
    setSelectedCategory("all")
    setSearchTerm("")
    setSortBy("popular")
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
          <span className="text-white">Tất cả sản phẩm</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="bg-gray-800 border-gray-700 sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Filter className="h-5 w-5 text-yellow-400 mr-2" />
                  <h2 className="text-lg font-semibold text-white">Bộ lọc</h2>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <h3 className="font-medium text-white mb-4">Tìm kiếm</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm sản phẩm..."
                      className="bg-gray-700 border-gray-600 text-white pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium text-white mb-4">Danh mục</h3>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Tất cả danh mục" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium text-white mb-4">Khoảng giá</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000000}
                    step={1000000}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-6">
                  <h3 className="font-medium text-white mb-4">Thương hiệu</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {brands.length > 0 ? (
                      brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={brand}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => toggleBrand(brand)}
                          />
                          <label htmlFor={brand} className="text-gray-300 text-sm cursor-pointer">
                            {brand}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">Đang tải...</p>
                    )}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300"
                  onClick={clearFilters}
                >
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Tất cả sản phẩm</h1>
                <p className="text-gray-400">{products.length} sản phẩm</p>
              </div>

              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="popular">Phổ biến nhất</SelectItem>
                    <SelectItem value="price_asc">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price_desc">Giá cao đến thấp</SelectItem>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex bg-gray-800 rounded-lg p-1">
                  <Button
                    size="sm"
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-yellow-600 text-black" : "text-gray-400"}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "list" ? "default" : "ghost"}
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-yellow-600 text-black" : "text-gray-400"}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {productsLoading ? (
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <Skeleton className="w-full h-48 mb-4 bg-gray-700" />
                      <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
                      <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
                      <Skeleton className="h-4 w-20 mb-2 bg-gray-700" />
                      <Skeleton className="h-6 w-24 bg-gray-700" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {viewMode === "grid" ? (
                  products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  products.map((product) => (
                    <Link key={product._id} href={`/product/${product._id}`}>
                      <Card className="bg-gray-800 border-gray-700 hover:border-yellow-600 transition-all cursor-pointer flex">
                        <CardContent className="p-4 flex items-center space-x-6">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.product_name}
                              width={128}
                              height={128}
                              className="object-contain bg-gray-700 rounded-lg w-full h-full"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=128&width=128"
                              }}
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.product_name}</h3>

                            <div className="flex items-center mb-2">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-current" : ""}`} />
                                ))}
                              </div>
                              <span className="text-gray-400 text-sm ml-2">(50+)</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-yellow-400 font-bold text-lg">{formatPrice(product.price)}</span>
                              </div>
                              <Badge className={product.stock_quantity > 0 ? "bg-green-600" : "bg-red-600"}>
                                {product.stock_quantity > 0 ? "Còn hàng" : "Hết hàng"}
                              </Badge>
                            </div>

                            {product.brand && (
                              <div className="mt-2">
                                <span className="text-gray-400 text-xs">Thương hiệu: {product.brand}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Không tìm thấy sản phẩm nào</p>
                <p className="text-gray-500 text-sm mt-2">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    Trước
                  </Button>
                  <Button className="bg-yellow-600 text-black">1</Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    2
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    3
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
