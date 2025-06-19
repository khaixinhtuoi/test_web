"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, User, Heart, ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    
    // Kiểm tra trạng thái đăng nhập từ localStorage hoặc cookies
    const checkLoginStatus = () => {
      const token = localStorage.getItem('userToken')
      setIsLoggedIn(!!token)
    }
    
    checkLoginStatus()
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const categories = [
    "iPhone",
    "Samsung",
    "Xiaomi",
    "OPPO",
    "Vivo",
    "Laptop",
    "Tablet",
    "Smartwatch",
    "Tai nghe",
    "Phụ kiện",
  ]

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-custom backdrop-blur-md bg-black/95' : 'bg-black'}`}>
      {/* Top bar */}
      <div className="bg-dark-gray py-2 text-sm border-b border-border-color">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6 text-text-secondary">
            <span>📞 Hotline: 1900-1234</span>
            <span className="hidden md:inline">🚚 Miễn phí vận chuyển từ 2 triệu</span>
          </div>
          <div className="flex items-center space-x-4 text-text-secondary">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="hover:text-gold transition-colors">
                  Tài khoản
                </Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('userToken')
                    localStorage.removeItem('userData')
                    setIsLoggedIn(false)
                    window.location.reload()
                  }} 
                  className="hover:text-gold transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth" className="hover:text-gold transition-colors">
                  Đăng nhập
                </Link>
                <Link 
                  href="/auth?tab=register" 
                  className="hover:text-gold transition-colors border-l border-gray-600 pl-4"
                >
                  Đăng ký
                </Link>
              </div>
            )}
            <Link href="/admin" className="hover:text-gold transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-border-color">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:text-gold hover:bg-dark-medium">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-dark-medium border-dark-light">
                  <div className="flex flex-col h-full pt-6">
                    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-white to-gold bg-clip-text text-transparent mb-8">
                      TechStore
                    </Link>
                    <nav className="space-y-1">
                      {categories.map((category) => (
                        <Link
                          key={category}
                          href={`/category/${category.toLowerCase()}`}
                          className="block py-2.5 px-4 text-text-secondary hover:text-gold hover:bg-dark-light rounded-md transition-all"
                        >
                          {category}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-white to-gold bg-clip-text text-transparent"
            >
              TechStore
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full bg-dark-medium border-dark-light text-white placeholder:text-text-secondary rounded-full h-10 pl-4 pr-10 focus:border-gold focus:ring-gold"
                />
                <Button 
                  size="icon" 
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent text-text-secondary hover:text-gold h-7 w-7"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* User actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" asChild className="rounded-full bg-dark-medium text-white hover:text-gold hover:bg-dark-light">
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-dark-medium text-white hover:text-gold hover:bg-dark-light">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative rounded-full bg-dark-medium text-white hover:text-gold hover:bg-dark-light" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-2 -right-2 bg-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center p-0 font-semibold">3</Badge>
                </Link>
              </Button>
              
              {/* Mobile search button */}
              <Button variant="ghost" size="icon" className="md:hidden rounded-full bg-dark-medium text-white hover:text-gold hover:bg-dark-light">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-dark-gray py-3 border-b border-border-color hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 overflow-x-auto">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="text-text-secondary hover:text-gold transition-colors whitespace-nowrap text-sm font-medium relative group"
              >
                {category}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
