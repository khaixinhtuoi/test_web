"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, Minus, Plus, Truck, Shield, RotateCcw, CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ProductDetailPage() {
  const [selectedColor, setSelectedColor] = useState("purple")
  const [selectedStorage, setSelectedStorage] = useState("256GB")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [mainImage, setMainImage] = useState("/placeholder.svg?height=500&width=500")

  const colors = [
    { id: "purple", name: "Xanh tím", color: "#7B68EE" },
    { id: "green", name: "Xanh lá mạ", color: "#32CD32" },
    { id: "pink", name: "Hồng", color: "#FF69B4" },
    { id: "white", name: "Trắng", color: "#f8fafc" },
  ]

  const storageOptions = ["128GB", "256GB", "512GB", "1TB"]

  const thumbnails = [
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
  ]

  const relatedProducts = [
    {
      id: 1,
      name: "iPhone 16 128GB",
      price: "26.990.000₫",
      rating: 4.5,
      reviews: 98,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "iPhone 16 Pro 256GB",
      price: "29.990.000₫",
      rating: 4.7,
      reviews: 112,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "AirPods Pro 2",
      price: "6.790.000₫",
      rating: 4.6,
      reviews: 76,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      name: "Apple Watch Series 9",
      price: "10.990.000₫",
      rating: 4.8,
      reviews: 64,
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const formatPrice = (price: string) => price

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
          <Link href="/category/iphone" className="hover:text-yellow-400">
            iPhone
          </Link>
          <span>/</span>
          <span className="text-white">iPhone 16</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Gallery */}
          <div>
            <div className="bg-gray-800 rounded-lg p-8 mb-4">
              <Image
                src={mainImage || "/placeholder.svg"}
                alt="iPhone 16"
                width={500}
                height={500}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="flex space-x-3">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(thumb)}
                  className={`w-20 h-20 bg-gray-800 rounded-lg p-2 border-2 transition-colors ${
                    mainImage === thumb ? "border-yellow-600" : "border-transparent hover:border-gray-600"
                  }`}
                >
                  <Image
                    src={thumb || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">iPhone 16</h1>

            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < 4 ? "fill-current" : ""}`} />
                  ))}
                </div>
                <span className="text-gray-400 ml-2">(128 đánh giá)</span>
              </div>
              <span className="text-gray-400">SKU: IP16-256-TN</span>
              <Badge className="bg-green-600">Còn hàng</Badge>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-yellow-400">31.990.000₫</span>
              <span className="text-xl text-gray-400 line-through ml-4">35.990.000₫</span>
              <Badge className="bg-red-600 ml-2">-11%</Badge>
            </div>

            <p className="text-gray-300 mb-8 leading-relaxed">
              iPhone 16 với chip A18 mạnh mẽ, camera chuyên nghiệp 48MP, màn hình Super Retina XDR 6.7 inch và thời
              lượng pin cả ngày. Thiết kế từ titan hàng không vũ trụ bền bỉ, nhẹ và sang trọng với nhiều cải tiến đột
              phá.
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Màu sắc</h3>
              <div className="flex space-x-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-12 h-12 rounded-full border-2 transition-colors ${
                      selectedColor === color.id ? "border-yellow-600" : "border-gray-600"
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Storage Selection */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Dung lượng</h3>
              <div className="flex space-x-3">
                {storageOptions.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedStorage === storage
                        ? "border-yellow-600 bg-yellow-600/10 text-yellow-400"
                        : "border-gray-600 text-gray-300 hover:border-yellow-600"
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-3">Số lượng</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-800 rounded-full">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-white hover:bg-gray-700"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 text-white font-medium">{quantity}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-white hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`border-gray-600 ${isWishlisted ? "text-red-400 border-red-400" : "text-gray-400"}`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <Truck className="h-5 w-5 text-yellow-400 mr-3" />
                <span>Giao hàng miễn phí cho đơn hàng từ 2 triệu đồng</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Shield className="h-5 w-5 text-yellow-400 mr-3" />
                <span>Bảo hành chính hãng 12 tháng</span>
              </div>
              <div className="flex items-center text-gray-300">
                <RotateCcw className="h-5 w-5 text-yellow-400 mr-3" />
                <span>Đổi trả trong vòng 15 ngày</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CreditCard className="h-5 w-5 text-yellow-400 mr-3" />
                <span>Trả góp 0% lãi suất</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger
              value="description"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black"
            >
              Mô tả
            </TabsTrigger>
            <TabsTrigger value="specs" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              Thông số kỹ thuật
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              Đánh giá (128)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold text-white">iPhone 16 - Đỉnh cao công nghệ</h3>
                <p>
                  iPhone 16 là chiếc iPhone mạnh mẽ nhất, đa năng nhất và tiên tiến nhất từ trước đến nay. Với thiết kế
                  từ titan hàng không vũ trụ - vật liệu cùng loại được sử dụng trong tàu thăm dò sao Hỏa, iPhone 16 vừa
                  bền bỉ vừa nhẹ đến bất ngờ.
                </p>

                <h4 className="text-lg font-semibold text-white">Chip A18 - Hiệu năng đột phá</h4>
                <p>
                  A18 là chip mới nhất trong ngành smartphone được chế tạo theo quy trình tiên tiến, mang đến hiệu năng
                  và hiệu quả năng lượng vượt trội. CPU 8 lõi mới nhanh hơn 20% và GPU 6 lõi mới nhanh hơn tới 30% so
                  với thế hệ trước.
                </p>

                <h4 className="text-lg font-semibold text-white">Hệ thống camera chuyên nghiệp</h4>
                <p>
                  Camera chính 48MP với khẩu độ f/1.6 cho phép chụp ảnh độ phân giải cao với chi tiết sắc nét. Camera
                  Ultra Wide 12MP với khẩu độ f/2.2 giúp bạn bắt trọn khung cảnh rộng lớn. Camera Telephoto 12MP với
                  khẩu độ f/2.8 và zoom quang học 5x cho phép bạn chụp từ xa mà vẫn giữ được chất lượng hình ảnh.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Màn hình</span>
                      <span className="text-white">Super Retina XDR OLED 6.7 inch</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Chip</span>
                      <span className="text-white">A18</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Dung lượng</span>
                      <span className="text-white">256GB</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Camera chính</span>
                      <span className="text-white">48MP, f/1.6</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Pin</span>
                      <span className="text-white">Lên đến 32 giờ xem video</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Kết nối</span>
                      <span className="text-white">5G, Wi-Fi 7, Bluetooth 5.4</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Chống nước</span>
                      <span className="text-white">IP68</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Trọng lượng</span>
                      <span className="text-white">219 gram</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                {/* Review Summary */}
                <div className="flex items-center mb-8 p-6 bg-gray-700 rounded-lg">
                  <div className="text-center mr-8">
                    <div className="text-4xl font-bold text-yellow-400">4.7</div>
                    <div className="flex text-yellow-400 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-current" : ""}`} />
                      ))}
                    </div>
                    <div className="text-gray-400 text-sm">128 đánh giá</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <span className="text-gray-400 w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-600 rounded-full h-2 mx-3">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: rating === 5 ? "75%" : rating === 4 ? "20%" : "3%" }}
                          />
                        </div>
                        <span className="text-gray-400 text-sm w-10">
                          {rating === 5 ? "75%" : rating === 4 ? "20%" : "3%"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-white">Nguyễn Văn A</h4>
                        <p className="text-gray-400 text-sm">15/03/2024</p>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Đây là chiếc iPhone tốt nhất mà tôi từng sử dụng. Camera chụp ảnh cực kỳ đẹp, pin dùng cả ngày
                      không lo hết. Màn hình 120Hz mượt mà, chơi game rất đã. Thiết kế titan nhẹ hơn nhiều so với iPhone
                      15 Pro Max mà tôi đã dùng trước đó. Rất đáng đồng tiền bát gạo!
                    </p>
                  </div>

                  <div className="border-b border-gray-700 pb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-white">Trần Thị B</h4>
                        <p className="text-gray-400 text-sm">10/03/2024</p>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                        <Star className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Camera chụp ảnh rất đẹp, màu sắc trung thực. Pin dùng được cả ngày với mức sử dụng cao. Màn hình
                      rất sắc nét và mượt mà. Tuy nhiên, giá hơi cao và cổng USB-C mới cần phải mua lại phụ kiện. Nhìn
                      chung vẫn rất hài lòng với sản phẩm.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Sản phẩm liên quan</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="bg-gray-800 border-gray-700 hover:border-yellow-600 transition-all hover:scale-105 cursor-pointer">
                  <CardContent className="p-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-contain bg-gray-700 rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : ""}`} />
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm ml-2">({product.reviews})</span>
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">{product.price}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
