"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Filter, Grid, List, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePublicProducts, usePublicCategories } from "@/hooks/use-public-api"
import { ProductCard } from "@/components/product-card"
import { type Product } from "@/lib/api"

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("popular")
  const [currentCategory, setCurrentCategory] = useState<string>("")
  const [slug, setSlug] = useState<string>("")

  // Resolve params
  React.useEffect(() => {
    params.then(resolvedParams => {
      setSlug(resolvedParams.slug)
    })
  }, [params])

  const categoryName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : ""

  // Lấy dữ liệu từ API
  const { data: categoriesData } = usePublicCategories()
  const { data: productsData, isLoading: productsLoading } = usePublicProducts({
    category: currentCategory,
    min_price: priceRange[0],
    max_price: priceRange[1],
    brands: selectedBrands.length > 0 ? selectedBrands : undefined,
    sort: sortBy as 'price_asc' | 'price_desc' | 'newest',
    limit: 20, // Tăng số lượng sản phẩm hiển thị
  })

  // Lấy tất cả products để có danh sách brands (không filter)
  const { data: allProductsData } = usePublicProducts({
    category: currentCategory,
    limit: 1000, // Lấy nhiều để có đủ brands
  })

  const products = productsData?.products || []
  const categories = categoriesData?.categories || []
  const allProducts = allProductsData?.products || []

  // Tìm category ID từ slug
  useEffect(() => {
    if (slug && categories.length > 0) {
      const category = categories.find(cat =>
        cat.category_name.toLowerCase() === slug.toLowerCase()
      )
      if (category) {
        setCurrentCategory(category._id)
      }
    }
  }, [categories, slug])

  // Lấy danh sách brands từ tất cả products trong category
  const brands = Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean)))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫"
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  // Sử dụng products từ API (đã được filter server-side)
  const filteredProducts = products

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
          <span className="text-white">{categoryName}</span>
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
                  <div className="space-y-3">
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
                  onClick={() => {
                    setPriceRange([0, 50000000])
                    setSelectedBrands([])
                  }}
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
                <h1 className="text-2xl font-bold text-white mb-2">{categoryName}</h1>
                <p className="text-gray-400">{filteredProducts.length} sản phẩm</p>
              </div>

              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="popular">Phổ biến nhất</SelectItem>
                    <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
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
            ) : filteredProducts.length > 0 ? (
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {viewMode === "grid" ? (
                  filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  // List view - sử dụng layout tùy chỉnh
                  filteredProducts.map((product) => (
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
          </div>
        </div>
      </div>
    </div>
  )
}
