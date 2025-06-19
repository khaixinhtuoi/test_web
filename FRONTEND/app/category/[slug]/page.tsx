"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Filter, Grid, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  const products = [
    {
      id: 1,
      name: "iPhone 16 Pro Max 256GB",
      price: 31990000,
      originalPrice: 35990000,
      discount: 11,
      rating: 4.8,
      reviews: 128,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Apple",
      inStock: true,
      isNew: true,
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: 29990000,
      originalPrice: 32990000,
      discount: 9,
      rating: 4.7,
      reviews: 95,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Samsung",
      inStock: true,
      isHot: true,
    },
    {
      id: 3,
      name: "Xiaomi 14 Ultra",
      price: 24990000,
      originalPrice: 27990000,
      discount: 11,
      rating: 4.6,
      reviews: 67,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Xiaomi",
      inStock: true,
      isBestSeller: true,
    },
    {
      id: 4,
      name: "OPPO Find X7 Pro",
      price: 22990000,
      originalPrice: 25990000,
      discount: 12,
      rating: 4.5,
      reviews: 89,
      image: "/placeholder.svg?height=300&width=300",
      brand: "OPPO",
      inStock: false,
      isNew: false,
    },
    {
      id: 5,
      name: "Vivo X100 Pro",
      price: 21990000,
      originalPrice: 24990000,
      discount: 12,
      rating: 4.4,
      reviews: 56,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Vivo",
      inStock: true,
      isNew: false,
    },
    {
      id: 6,
      name: "iPhone 15 Pro",
      price: 27990000,
      originalPrice: 30990000,
      discount: 10,
      rating: 4.7,
      reviews: 234,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Apple",
      inStock: true,
      isNew: false,
    },
  ]

  const brands = ["Apple", "Samsung", "Xiaomi", "OPPO", "Vivo"]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const filteredProducts = products.filter((product) => {
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesBrand && matchesPrice
  })

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
                    {brands.map((brand) => (
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
                    ))}
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
                <Select defaultValue="popular">
                  <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="popular">Phổ biến nhất</SelectItem>
                    <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
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
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card
                    className={`bg-gray-800 border-gray-700 hover:border-yellow-600 transition-all hover:scale-105 cursor-pointer ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <CardContent className={`p-4 ${viewMode === "list" ? "flex items-center space-x-6" : ""}`}>
                      <div className={`relative ${viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "mb-4"}`}>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={viewMode === "list" ? 128 : 300}
                          height={viewMode === "list" ? 128 : 200}
                          className={`object-contain bg-gray-700 rounded-lg ${
                            viewMode === "list" ? "w-full h-full" : "w-full h-48"
                          }`}
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 space-y-1">
                          {product.isNew && <Badge className="bg-green-600 text-white text-xs">Mới</Badge>}
                          {product.isHot && <Badge className="bg-red-600 text-white text-xs">Hot</Badge>}
                          {product.isBestSeller && <Badge className="bg-purple-600 text-white text-xs">Bán chạy</Badge>}
                        </div>

                        {product.discount > 0 && (
                          <Badge className="absolute top-2 right-2 bg-red-600 text-white text-xs">
                            -{product.discount}%
                          </Badge>
                        )}
                      </div>

                      <div className={viewMode === "list" ? "flex-1" : ""}>
                        <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.name}</h3>

                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-400 text-sm ml-2">({product.reviews})</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-yellow-400 font-bold text-lg">{formatPrice(product.price)}</span>
                            {product.originalPrice && (
                              <span className="text-gray-400 text-sm line-through ml-2">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <Badge className={product.inStock ? "bg-green-600" : "bg-red-600"}>
                            {product.inStock ? "Còn hàng" : "Hết hàng"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

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
