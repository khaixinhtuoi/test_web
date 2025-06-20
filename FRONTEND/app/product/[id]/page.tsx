"use client"

import React, { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePublicProduct } from "@/hooks/use-public-api"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductActions } from "@/components/product-actions"
import { RelatedProducts } from "@/components/related-products"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [productId, setProductId] = useState<string>("")

  // Resolve params
  React.useEffect(() => {
    params.then(resolvedParams => {
      setProductId(resolvedParams.id)
    })
  }, [params])

  const { data: productData, isLoading: productLoading, error } = usePublicProduct(productId)
  const product = productData?.product

  // Tạo rating giả lập cho reviews
  const rating = product ? 4.0 + (product.product_name.length % 10) / 10 : 0
  const reviews = product ? 50 + (product.product_name.length % 100) : 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫"
  }

  // Loading state
  if (productLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Skeleton className="w-full h-96 bg-gray-700 rounded-lg mb-4" />
              <div className="flex space-x-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 bg-gray-700 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4 bg-gray-700" />
              <Skeleton className="h-6 w-1/2 bg-gray-700" />
              <Skeleton className="h-8 w-1/3 bg-gray-700" />
              <Skeleton className="h-20 w-full bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">Không tìm thấy sản phẩm</h1>
            <p className="text-gray-400 mb-8">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link href="/products">
              <Button className="bg-gold hover:bg-gold-hover text-black">
                Quay lại danh sách sản phẩm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
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
          {product.category_id && (
            <>
              <Link
                href={`/category/${product.category_id.category_name.toLowerCase()}`}
                className="hover:text-yellow-400"
              >
                {product.category_id.category_name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-white">{product.product_name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Gallery */}
          <ProductGallery
            images={[product.image_url || "/placeholder.svg"]}
            productName={product.product_name}
          />

          {/* Product Info and Actions */}
          <div className="space-y-8">
            <ProductInfo product={product} />
            <ProductActions product={product} />
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
              Đánh giá ({reviews})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold text-white">{product.product_name} - Chi tiết sản phẩm</h3>
                <div className="prose prose-invert max-w-none">
                  {product.description ? (
                    <p className="whitespace-pre-line">{product.description}</p>
                  ) : (
                    <div className="space-y-4">
                      <p>
                        {product.product_name} là sản phẩm chất lượng cao với thiết kế hiện đại và tính năng vượt trội.
                      </p>
                      <p>
                        Sản phẩm được thiết kế với công nghệ tiên tiến, mang đến trải nghiệm tuyệt vời cho người dùng.
                      </p>
                      <p>
                        Với chất lượng được đảm bảo và dịch vụ hậu mãi tốt, đây là lựa chọn hoàn hảo cho bạn.
                      </p>
                    </div>
                  )}
                </div>

                {product.brand && (
                  <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-2">Thông tin thương hiệu</h4>
                    <p>Thương hiệu: <span className="text-yellow-400">{product.brand}</span></p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-white">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Tên sản phẩm</span>
                        <span className="text-white">{product.product_name}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Thương hiệu</span>
                        <span className="text-white">{product.brand || "Không có thông tin"}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Danh mục</span>
                        <span className="text-white">{product.category_id?.category_name || "Không có thông tin"}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Giá</span>
                        <span className="text-white">{formatPrice(product.price)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Tình trạng kho</span>
                        <span className="text-white">{product.stock_quantity} sản phẩm</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Trạng thái</span>
                        <span className="text-white">{product.stock_quantity > 0 ? "Còn hàng" : "Hết hàng"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                {/* Review Summary */}
                <div className="flex items-center mb-8 p-6 bg-gray-700 rounded-lg">
                  <div className="text-center mr-8">
                    <div className="text-4xl font-bold text-yellow-400">{rating.toFixed(1)}</div>
                    <div className="flex text-yellow-400 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-current" : ""}`} />
                      ))}
                    </div>
                    <div className="text-gray-400 text-sm">{reviews} đánh giá</div>
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
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  )
}
