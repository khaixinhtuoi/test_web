"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Truck, Shield, RotateCcw, CreditCard, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePublicProducts, usePublicCategories } from "@/hooks/use-public-api"
import { ProductCard } from "@/components/product-card"

export default function HomePage() {
  // Lấy dữ liệu từ API
  const { data: productsData, isLoading: productsLoading } = usePublicProducts({ limit: 10 })
  const { data: categoriesData, isLoading: categoriesLoading } = usePublicCategories()

  const products = productsData?.products || []
  const categories = categoriesData?.categories || []
  // Mapping icons cho categories
  const categoryIcons: Record<string, string> = {
    "Điện thoại": "📱",
    "Laptop": "💻",
    "Tablet": "📱",
    "Smartwatch": "⌚",
    "Tai nghe": "🎧",
    "Phụ kiện": "🔌",
  }

  const promotions = [
    {
      title: "Ưu đãi đặc biệt",
      description: "Giảm đến 30% cho iPhone",
      image: "/placeholder.svg?height=200&width=400",
      color: "from-purple-600 to-blue-500",
    },
    {
      title: "Phụ kiện chất lượng",
      description: "Mua 2 tặng 1 tất cả phụ kiện",
      image: "/placeholder.svg?height=200&width=400",
      color: "from-amber-500 to-pink-500",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-dark-gray overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <span className="inline-block text-gold text-sm font-medium tracking-wider uppercase mb-4">TechStore - Công nghệ chính hãng</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                Khám phá đẳng cấp mới của <span className="bg-gradient-to-r from-white to-gold bg-clip-text text-transparent">công nghệ hiện đại</span>
              </h1>
              <p className="text-lg text-text-secondary mb-8 max-w-xl">
                Thiết bị điện tử chính hãng với giá tốt nhất, bảo hành chính hãng và dịch vụ chăm sóc khách hàng tận tâm 24/7
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gold hover:bg-gold-hover text-black font-medium rounded-full">
                  Mua ngay
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-black font-medium rounded-full"
                >
                  Khám phá thêm
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute w-full h-full bg-gradient-to-r from-gold/20 to-transparent rounded-full blur-3xl opacity-30"></div>
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Hero Product"
                width={600}
                height={600}
                className="relative z-10 object-contain"
              />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/30 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-transparent opacity-60"></div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Danh mục sản phẩm</h2>
            <Link href="/category" className="text-gold hover:text-gold-hover font-medium text-sm flex items-center">
              Xem tất cả
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categoriesLoading ? (
              // Loading skeleton cho categories
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="bg-dark-medium border-dark-light rounded-xl">
                  <CardContent className="p-6 text-center">
                    <Skeleton className="h-12 w-12 mx-auto mb-4 bg-gray-700" />
                    <Skeleton className="h-4 w-20 mx-auto mb-1 bg-gray-700" />
                    <Skeleton className="h-3 w-16 mx-auto bg-gray-700" />
                  </CardContent>
                </Card>
              ))
            ) : (
              categories.map((category) => (
                <Link key={category._id} href={`/category/${category.category_name.toLowerCase()}`}>
                  <Card className="bg-dark-medium border-dark-light hover:border-gold transition-all cursor-pointer overflow-hidden group rounded-xl">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                        {categoryIcons[category.category_name] || "📦"}
                      </div>
                      <h3 className="font-semibold text-white mb-1">{category.category_name}</h3>
                      <p className="text-text-secondary text-sm">Khám phá ngay</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Banner Promotions */}
      <section className="py-10 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {promotions.map((promo, index) => (
              <div 
                key={index}
                className={`rounded-2xl overflow-hidden relative h-48 bg-gradient-to-r ${promo.color} group cursor-pointer`}
              >
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-8">
                  <h3 className="text-white text-2xl font-bold mb-2">{promo.title}</h3>
                  <p className="text-white/80 mb-4">{promo.description}</p>
                  <Button className="w-fit bg-white hover:bg-white/90 text-black font-medium rounded-full">
                    Xem ngay
                  </Button>
                </div>
                <div className="absolute right-0 bottom-0 w-48 h-48">
                  <Image 
                    src={promo.image} 
                    alt={promo.title}
                    width={200}
                    height={200}
                    className="object-contain transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Sản phẩm nổi bật</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="border-dark-light text-text-secondary hover:text-gold hover:border-gold rounded-full h-10 w-10">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="border-dark-light text-text-secondary hover:text-gold hover:border-gold rounded-full h-10 w-10">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {productsLoading ? (
              // Loading skeleton cho products
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="bg-dark-medium border-dark-light rounded-xl">
                  <CardContent className="p-4">
                    <div className="relative mb-4 bg-dark-gray rounded-lg p-4">
                      <Skeleton className="w-full h-48 bg-gray-700" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
                    <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
                    <div className="flex items-center mb-2">
                      <Skeleton className="h-4 w-20 bg-gray-700" />
                    </div>
                    <Skeleton className="h-6 w-24 bg-gray-700" />
                  </CardContent>
                </Card>
              ))
            ) : (
              products.slice(0, 5).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
          <div className="mt-10 text-center">
            <Link href="/products">
              <Button className="bg-gold hover:bg-gold-hover text-black font-medium rounded-full">
                Xem tất cả sản phẩm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-dark-medium rounded-xl">
              <Truck className="h-10 w-10 text-gold mb-4" />
              <h3 className="font-semibold text-white mb-2 text-lg">Giao hàng miễn phí</h3>
              <p className="text-text-secondary">Đơn hàng từ 2 triệu đồng</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-dark-medium rounded-xl">
              <Shield className="h-10 w-10 text-gold mb-4" />
              <h3 className="font-semibold text-white mb-2 text-lg">Bảo hành chính hãng</h3>
              <p className="text-text-secondary">12 tháng toàn quốc</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-dark-medium rounded-xl">
              <RotateCcw className="h-10 w-10 text-gold mb-4" />
              <h3 className="font-semibold text-white mb-2 text-lg">Đổi trả dễ dàng</h3>
              <p className="text-text-secondary">Trong vòng 15 ngày</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-dark-medium rounded-xl">
              <CreditCard className="h-10 w-10 text-gold mb-4" />
              <h3 className="font-semibold text-white mb-2 text-lg">Trả góp 0%</h3>
              <p className="text-text-secondary">Lãi suất ưu đãi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-dark-light py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gold mb-4">TechStore</h3>
              <p className="text-text-secondary mb-4">Cửa hàng điện tử uy tín hàng đầu Việt Nam</p>
              <p className="text-text-secondary"><span className="text-gold">📞</span> Hotline: 1900-1234</p>
              <p className="text-text-secondary"><span className="text-gold">📧</span> Email: info@techstore.vn</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-text-secondary">
                <li>
                  <Link href="/category/iphone" className="hover:text-gold transition-colors">
                    iPhone
                  </Link>
                </li>
                <li>
                  <Link href="/category/samsung" className="hover:text-gold transition-colors">
                    Samsung
                  </Link>
                </li>
                <li>
                  <Link href="/category/laptop" className="hover:text-gold transition-colors">
                    Laptop
                  </Link>
                </li>
                <li>
                  <Link href="/category/tablet" className="hover:text-gold transition-colors">
                    Tablet
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-text-secondary">
                <li>
                  <Link href="/support" className="hover:text-gold transition-colors">
                    Trung tâm hỗ trợ
                  </Link>
                </li>
                <li>
                  <Link href="/warranty" className="hover:text-gold transition-colors">
                    Bảo hành
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-gold transition-colors">
                    Vận chuyển
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-gold transition-colors">
                    Câu hỏi thường gặp
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Về chúng tôi</h4>
              <ul className="space-y-2 text-text-secondary">
                <li>
                  <Link href="/about" className="hover:text-gold transition-colors">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-gold transition-colors">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link href="/career" className="hover:text-gold transition-colors">
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-gold transition-colors">
                    Tin tức
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-dark-light flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-secondary text-sm mb-4 md:mb-0">© 2023 TechStore. Tất cả quyền được bảo lưu.</p>
            <div className="flex items-center space-x-6">
              <Link href="#" className="text-text-secondary hover:text-gold transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </Link>
              <Link href="#" className="text-text-secondary hover:text-gold transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </Link>
              <Link href="#" className="text-text-secondary hover:text-gold transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
