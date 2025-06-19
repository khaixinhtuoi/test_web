"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Facebook, Mail, ArrowRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Kiểm tra xem có tab parameter trong URL không
    const tabParam = searchParams.get("tab")
    if (tabParam === "register" || tabParam === "login") {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Giả lập đăng nhập thành công
      // Trong thực tế, bạn sẽ gọi API đăng nhập và nhận về token
      setTimeout(() => {
        // Lưu token vào localStorage
        localStorage.setItem('userToken', 'sample-token-value')
        localStorage.setItem('userData', JSON.stringify({
          id: 1,
          name: "Nguyễn Văn A",
          email: loginEmail,
          isVip: true
        }))
        
        // Chuyển hướng đến trang profile
        router.push('/profile')
      }, 1500)
    } catch (error) {
      console.error('Đăng nhập thất bại', error)
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Giả lập đăng ký thành công
      setTimeout(() => {
        setIsLoading(false)
        // Hiển thị thông báo thành công và chuyển sang tab đăng nhập
        alert('Đăng ký thành công! Vui lòng đăng nhập.')
        // Chuyển về tab đăng nhập
        setActiveTab("login")
      }, 1500)
    } catch (error) {
      console.error('Đăng ký thất bại', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại</h1>
            <p className="text-text-secondary">Đăng nhập hoặc tạo tài khoản mới để tiếp tục</p>
          </div>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-dark-medium rounded-full p-1 h-12">
              <TabsTrigger 
                value="login" 
                className="rounded-full data-[state=active]:bg-gold data-[state=active]:text-black transition-all text-sm font-medium h-10"
              >
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-full data-[state=active]:bg-gold data-[state=active]:text-black transition-all text-sm font-medium h-10"
              >
                Đăng ký
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card className="bg-dark-medium border-dark-light rounded-xl">
                <CardContent className="p-6">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-text-secondary text-sm font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">
                          <Mail className="w-5 h-5" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          className="bg-dark-light border-dark-light text-white pl-10 h-12 focus:border-gold"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-text-secondary text-sm font-medium">
                          Mật khẩu
                        </Label>
                        <Link href="/forgot-password" className="text-gold text-xs hover:underline">
                          Quên mật khẩu?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="bg-dark-light border-dark-light text-white h-12 focus:border-gold"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" className="data-[state=checked]:bg-gold data-[state=checked]:border-gold" />
                      <Label htmlFor="remember" className="text-text-secondary text-sm leading-none">
                        Ghi nhớ đăng nhập
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gold hover:bg-gold-hover text-black font-medium rounded-full h-12"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  <div className="relative my-8">
                    <Separator className="bg-dark-light" />
                    <span className="text-text-secondary text-xs absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-medium px-2">
                      Hoặc đăng nhập với
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="border-dark-light text-text-secondary hover:bg-dark-light hover:text-white rounded-lg h-12">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" className="border-dark-light text-text-secondary hover:bg-dark-light hover:text-white rounded-lg h-12">
                      <Facebook className="w-5 h-5 mr-2 text-[#1877F2]" />
                      Facebook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <Card className="bg-dark-medium border-dark-light rounded-xl">
                <CardContent className="p-6">
                  <form onSubmit={handleRegister} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-text-secondary text-sm font-medium">
                          Họ
                        </Label>
                        <Input 
                          id="firstName" 
                          className="bg-dark-light border-dark-light text-white h-12 focus:border-gold" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-text-secondary text-sm font-medium">
                          Tên
                        </Label>
                        <Input 
                          id="lastName" 
                          className="bg-dark-light border-dark-light text-white h-12 focus:border-gold" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerEmail" className="text-text-secondary text-sm font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">
                          <Mail className="w-5 h-5" />
                        </div>
                        <Input
                          id="registerEmail"
                          type="email"
                          placeholder="your@email.com"
                          className="bg-dark-light border-dark-light text-white pl-10 h-12 focus:border-gold"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-text-secondary text-sm font-medium">
                        Số điện thoại
                      </Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="0xxxxxxxxx"
                        className="bg-dark-light border-dark-light text-white h-12 focus:border-gold" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword" className="text-text-secondary text-sm font-medium">
                        Mật khẩu
                      </Label>
                      <div className="relative">
                        <Input
                          id="registerPassword"
                          type={showPassword ? "text" : "password"}
                          className="bg-dark-light border-dark-light text-white h-12 focus:border-gold"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-text-secondary text-sm font-medium">
                        Xác nhận mật khẩu
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className="bg-dark-light border-dark-light text-white h-12 focus:border-gold"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" className="data-[state=checked]:bg-gold data-[state=checked]:border-gold" required />
                      <Label htmlFor="terms" className="text-text-secondary text-sm leading-tight">
                        Tôi đồng ý với{" "}
                        <Link href="/terms" className="text-gold hover:underline">
                          Điều khoản sử dụng
                        </Link>{" "}
                        và{" "}
                        <Link href="/privacy" className="text-gold hover:underline">
                          Chính sách bảo mật
                        </Link>
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gold hover:bg-gold-hover text-black font-medium rounded-full h-12"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : "Đăng ký"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-text-secondary text-sm">
                      Đã có tài khoản?{" "}
                      <button 
                        type="button" 
                        className="text-gold hover:underline"
                        onClick={() => setActiveTab("login")}
                      >
                        Đăng nhập
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
