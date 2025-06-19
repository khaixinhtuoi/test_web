"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  Camera,
  Eye,
  EyeOff,
  ChevronRight,
  MapPin,
  CalendarDays,
  CreditCard,
  AlertCircle,
  LogOut,
  ShoppingCart,
  Star,
  Truck,
  Clock,
  Receipt,
  XCircle,
  Check,
  BoxIcon,
  X
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"

interface UserData {
  id: number;
  name: string;
  email: string;
  isVip: boolean;
}

// Dữ liệu người dùng mẫu cho chế độ phát triển
const sampleUserData: UserData = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  isVip: true
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [userData, setUserData] = useState<UserData>(sampleUserData) // Sử dụng dữ liệu mẫu mặc định
  const [isTestMode, setIsTestMode] = useState(true) // Luôn ở chế độ kiểm thử
  const [activeTab, setActiveTab] = useState("profile") // Thêm state để quản lý tab đang hoạt động
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orderDetailOpen, setOrderDetailOpen] = useState(false)
  const [cancelOrderOpen, setCancelOrderOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // SKIP: Bỏ qua kiểm tra đăng nhập
    // Chỉ cần tải dữ liệu từ localStorage nếu có
    const userDataStr = localStorage.getItem('userData')
    if (userDataStr) {
      try {
        const parsedUserData = JSON.parse(userDataStr)
        setUserData(parsedUserData)
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu người dùng:', error)
        // Vẫn giữ dữ liệu mẫu nếu có lỗi
      }
    }
  }, [])

  const handleLogout = () => {
    if (isTestMode) {
      alert('Đang ở chế độ kiểm thử. Chức năng đăng xuất hiện không hoạt động.');
      return;
    }
    
    // Xóa token và thông tin người dùng khỏi localStorage
    localStorage.removeItem('userToken')
    localStorage.removeItem('userData')
    
    // Chuyển hướng về trang đăng nhập
    router.push('/auth')
  }

  const orders = [
    {
      id: "DH001234",
      date: "15/03/2024",
      status: "Đã giao",
      total: "31.990.000₫",
      items: 2,
    },
    {
      id: "DH001235",
      date: "10/03/2024",
      status: "Đang giao",
      total: "6.790.000₫",
      items: 1,
    },
    {
      id: "DH001236",
      date: "05/03/2024",
      status: "Đã hủy",
      total: "24.990.000₫",
      items: 1,
    },
  ]

  const wishlistItems = [
    {
      id: 1,
      name: "MacBook Pro M3",
      price: "39.990.000₫",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "iPad Pro M2",
      price: "24.990.000₫",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const recentActivities = [
    { text: "Đã thêm sản phẩm vào giỏ hàng", time: "3 giờ trước" },
    { text: "Đã đặt đơn hàng #DH001234", time: "2 ngày trước" },
    { text: "Đã đánh giá sản phẩm 'Samsung Galaxy S24'", time: "3 ngày trước" },
    { text: "Đã thay đổi thông tin tài khoản", time: "1 tuần trước" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    // Thêm logic xử lý cập nhật hồ sơ
  }

  const statusColor = (status: string) => {
    switch(status) {
      case "Đã giao": return "bg-green-500 text-white";
      case "Đang giao": return "bg-blue-500 text-white";
      case "Đã hủy": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  }

  // Hàm xử lý khi chuyển tab
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  }

  const handleViewOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  }
  
  const handleCancelOrder = (order: any) => {
    setSelectedOrder(order);
    setCancelOrderOpen(true);
  }

  const handleBuyAgain = (order: any) => {
    // Logic to handle buying again
    alert(`Thêm sản phẩm từ đơn hàng #${order.id} vào giỏ hàng`);
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {isTestMode && (
        <div className="bg-amber-500 text-black p-2 text-center text-sm">
          <strong>CHẾ ĐỘ KIỂM THỬ:</strong> Đang sử dụng dữ liệu mẫu - không yêu cầu đăng nhập trong môi trường phát triển
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <Card className="bg-dark-medium border-dark-light rounded-xl overflow-hidden sticky top-24">
                <div className="p-6 bg-gradient-to-b from-dark-light to-dark-medium">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative mb-4">
                      <Avatar className="w-28 h-28 border-4 border-gold">
                        <AvatarImage src="/placeholder.svg?height=96&width=96" className="object-cover" />
                        <AvatarFallback className="bg-dark-light text-white text-xl">
                          {userData.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 bg-gold hover:bg-gold-hover text-black rounded-full w-9 h-9 p-0 flex items-center justify-center"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <h2 className="text-xl font-bold text-white">{userData.name}</h2>
                    <p className="text-text-secondary text-sm">{userData.email}</p>
                    <Badge className="mt-2 bg-gold text-black font-medium">
                      {userData.isVip ? "VIP Gold" : "Thành viên"}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-2">
                  <Tabs value={activeTab} onValueChange={handleTabChange} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col bg-transparent h-auto p-0 space-y-1">
                      <TabsTrigger 
                        value="profile" 
                        className="w-full justify-start px-4 py-2.5 rounded-lg text-sm data-[state=active]:bg-dark-light data-[state=active]:text-gold"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Thông tin cá nhân
                      </TabsTrigger>
                      <TabsTrigger 
                        value="orders" 
                        className="w-full justify-start px-4 py-2.5 rounded-lg text-sm data-[state=active]:bg-dark-light data-[state=active]:text-gold"
                      >
                        <Package className="h-4 w-4 mr-3" />
                        Đơn hàng của tôi
                      </TabsTrigger>
                      <TabsTrigger 
                        value="wishlist" 
                        className="w-full justify-start px-4 py-2.5 rounded-lg text-sm data-[state=active]:bg-dark-light data-[state=active]:text-gold"
                      >
                        <Heart className="h-4 w-4 mr-3" />
                        Sản phẩm yêu thích
                      </TabsTrigger>
                      <TabsTrigger 
                        value="settings" 
                        className="w-full justify-start px-4 py-2.5 rounded-lg text-sm data-[state=active]:bg-dark-light data-[state=active]:text-gold"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Cài đặt tài khoản
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <Separator className="my-4 bg-dark-light" />
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-4 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-dark-light hover:text-gold"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Đăng xuất
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:w-3/4">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                {/* Profile Tab */}
                <TabsContent value="profile">
                  <Card className="bg-dark-medium border-dark-light rounded-xl mb-6">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-xl text-white">Thông tin cá nhân</CardTitle>
                          <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                        </div>
                        <Button
                          type="button"
                          onClick={() => setIsEditing(!isEditing)}
                          className={isEditing ? "bg-dark-light text-text-secondary border border-dark-light" : "bg-gold hover:bg-gold-hover text-black"}
                        >
                          {isEditing ? "Hủy" : "Chỉnh sửa"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-text-secondary">
                              Họ
                            </Label>
                            <Input
                              id="firstName"
                              defaultValue={userData.name.split(" ")[0]}
                              className="bg-dark-light border-dark-light text-white h-12 focus:border-gold focus:ring-gold"
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-text-secondary">
                              Tên
                            </Label>
                            <Input
                              id="lastName"
                              defaultValue={userData.name.split(" ").slice(1).join(" ")}
                              className="bg-dark-light border-dark-light text-white h-12 focus:border-gold focus:ring-gold"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-text-secondary">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            defaultValue={userData.email}
                            className="bg-dark-light border-dark-light text-white h-12 focus:border-gold focus:ring-gold"
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-text-secondary">
                            Số điện thoại
                          </Label>
                          <Input
                            id="phone"
                            defaultValue="0123456789"
                            className="bg-dark-light border-dark-light text-white h-12 focus:border-gold focus:ring-gold"
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-text-secondary">
                            Địa chỉ
                          </Label>
                          <Input
                            id="address"
                            defaultValue="123 Đường ABC, Quận 1, TP.HCM"
                            className="bg-dark-light border-dark-light text-white h-12 focus:border-gold focus:ring-gold"
                            disabled={!isEditing}
                          />
                        </div>

                        {isEditing && (
                          <Button 
                            type="submit" 
                            className="bg-gold hover:bg-gold-hover text-black font-medium"
                          >
                            Lưu thay đổi
                          </Button>
                        )}
                      </form>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-dark-medium border-dark-light rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Hoạt động gần đây</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-dark-light rounded-lg hover:border-l-4 hover:border-l-gold transition-all">
                            <div className="w-10 h-10 rounded-full bg-dark-medium flex items-center justify-center">
                              {index === 0 ? (
                                <ShoppingCart className="h-5 w-5 text-gold" />
                              ) : index === 1 ? (
                                <Package className="h-5 w-5 text-gold" />
                              ) : index === 2 ? (
                                <Star className="h-5 w-5 text-gold" />
                              ) : (
                                <User className="h-5 w-5 text-gold" />
                              )}
                            </div>
                            <div>
                              <p className="text-white">{activity.text}</p>
                              <p className="text-text-secondary text-xs">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders">
                  <Card className="bg-dark-medium border-dark-light rounded-xl">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-xl text-white">Đơn hàng của tôi</CardTitle>
                          <CardDescription>Quản lý và theo dõi đơn hàng của bạn</CardDescription>
                        </div>
                        <Link href="#">
                          <Button variant="outline" className="border-dark-light text-text-secondary hover:bg-dark-light hover:text-white">
                            Xem tất cả
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-5 bg-dark-light rounded-xl hover:border-l-4 hover:border-l-gold transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-dark-medium flex items-center justify-center">
                                <Package className="h-6 w-6 text-gold" />
                              </div>
                              <div>
                                <h3 className="font-medium text-white">Đơn hàng #{order.id}</h3>
                                <div className="flex items-center gap-3 text-text-secondary text-sm mt-1">
                                  <div className="flex items-center">
                                    <CalendarDays className="h-3.5 w-3.5 mr-1" />
                                    {order.date}
                                  </div>
                                  <div className="flex items-center">
                                    <Package className="h-3.5 w-3.5 mr-1" />
                                    {order.items} sản phẩm
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-gold font-semibold">{order.total}</p>
                              <Badge className={`mt-1 ${statusColor(order.status)}`}>
                                {order.status}
                              </Badge>
                              <div className="flex gap-2 mt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-xs h-8 w-24"
                                  onClick={() => handleViewOrderDetail(order)}
                                >
                                  Xem chi tiết
                                </Button>
                                {order.status === "Đang giao" && (
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="text-xs h-8 w-24"
                                    onClick={() => handleCancelOrder(order)}
                                  >
                                    Hủy đơn
                                  </Button>
                                )}
                                {order.status === "Đã giao" && (
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    className="bg-gold hover:bg-gold-hover text-black text-xs h-8 w-24"
                                    onClick={() => handleBuyAgain(order)}
                                  >
                                    Mua lại
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Wishlist Tab */}
                <TabsContent value="wishlist">
                  <Card className="bg-dark-medium border-dark-light rounded-xl">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-xl text-white">Sản phẩm yêu thích</CardTitle>
                          <CardDescription>Các sản phẩm bạn đã đánh dấu yêu thích</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {wishlistItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-dark-light rounded-xl group hover:border-gold hover:border transition-all">
                            <div className="w-20 h-20 bg-dark-medium rounded-lg p-2 flex items-center justify-center">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white group-hover:text-gold transition-colors">{item.name}</h3>
                              <p className="text-gold font-medium">{item.price}</p>
                            </div>
                            <Button size="sm" className="bg-gold hover:bg-gold-hover text-black rounded-full">
                              Mua ngay
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings">
                  <Card className="bg-dark-medium border-dark-light rounded-xl mb-6">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Đổi mật khẩu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-text-secondary">
                            Mật khẩu hiện tại
                          </Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPassword ? "text" : "password"}
                              className="bg-dark-light border-dark-light text-white h-12 focus:border-gold focus:ring-gold pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-text-secondary">
                            Mật khẩu mới
                          </Label>
                          <div className="relative">
                            <Input 
                              id="newPassword" 
                              type={showNewPassword ? "text" : "password"} 
                              className="bg-dark-light border-dark-light text-white h-12 focus:border-gold focus:ring-gold pr-10" 
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-text-secondary">
                            Xác nhận mật khẩu mới
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            className="bg-dark-light border-dark-light text-white h-12 focus:border-gold focus:ring-gold"
                          />
                        </div>
                        <Button className="bg-gold hover:bg-gold-hover text-black font-medium">Cập nhật mật khẩu</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-dark-medium border-dark-light rounded-xl mb-6">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Thông báo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Email thông báo đơn hàng</p>
                            <p className="text-text-secondary text-sm">Nhận thông báo về trạng thái đơn hàng</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <Separator className="bg-dark-light" />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Email khuyến mãi</p>
                            <p className="text-text-secondary text-sm">Nhận thông báo về khuyến mãi mới</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <Separator className="bg-dark-light" />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">SMS thông báo</p>
                            <p className="text-text-secondary text-sm">Nhận thông báo qua tin nhắn điện thoại</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-dark-medium border-dark-light rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Xóa tài khoản</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-lg mb-4 flex gap-3 items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <p className="text-text-secondary text-sm">
                          Việc xóa tài khoản là không thể khôi phục. Tất cả dữ liệu và thông tin của bạn sẽ bị xóa vĩnh viễn.
                        </p>
                      </div>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                        Xóa tài khoản
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="bg-dark-medium border-dark-light max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              {selectedOrder ? `Chi tiết đơn hàng #${selectedOrder.id}` : 'Chi tiết đơn hàng'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="overflow-y-auto max-h-[70vh]">
              {/* Order Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-dark-light p-4 rounded-lg">
                  <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">Mã đơn hàng</div>
                  <div className="text-white font-medium">#{selectedOrder.id}</div>
                </div>
                <div className="bg-dark-light p-4 rounded-lg">
                  <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">Ngày đặt hàng</div>
                  <div className="text-white font-medium">{selectedOrder.date} 14:30</div>
                </div>
                <div className="bg-dark-light p-4 rounded-lg">
                  <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">Trạng thái</div>
                  <div>
                    <Badge className={`${statusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
                <div className="bg-dark-light p-4 rounded-lg">
                  <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">Phương thức thanh toán</div>
                  <div className="text-white font-medium">Thẻ tín dụng</div>
                </div>
              </div>

              <Separator className="my-6 bg-dark-light" />

              {/* Shipping Information */}
              <div className="mb-6">
                <h3 className="flex items-center text-white font-medium mb-4">
                  <Truck className="h-4 w-4 mr-2 text-gold" />
                  Thông tin giao hàng
                </h3>
                
                <div className="bg-dark-light p-4 rounded-lg">
                  <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">Địa chỉ giao hàng</div>
                  <div className="text-white">
                    Nguyễn Văn A<br />
                    0123456789<br />
                    123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-dark-light" />

              {/* Products */}
              <div className="mb-6">
                <h3 className="flex items-center text-white font-medium mb-4">
                  <Package className="h-4 w-4 mr-2 text-gold" />
                  Sản phẩm đã đặt
                </h3>
                
                <div className="bg-dark-light p-4 rounded-lg flex items-center space-x-4">
                  <div className="bg-gold/20 w-20 h-20 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">iPhone 16 Pro Max</h4>
                    <p className="text-text-secondary text-sm">Màu: Titan Tự Nhiên | Dung lượng: 256GB</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-gold font-medium">{selectedOrder.total}</span>
                      <span className="text-text-secondary">Số lượng: 1</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-dark-light" />

              {/* Order Timeline */}
              <div className="mb-6">
                <h3 className="flex items-center text-white font-medium mb-4">
                  <Clock className="h-4 w-4 mr-2 text-gold" />
                  Lịch sử đơn hàng
                </h3>
                
                <div className="relative pl-6 space-y-6">
                  {/* Timeline items */}
                  <div className="relative">
                    <div className="absolute left-[-12px] top-1 w-3 h-3 bg-gold rounded-full"></div>
                    {selectedOrder.status === "Đã giao" && (
                      <>
                        <h4 className="text-white font-medium text-sm">Đơn hàng đã được giao</h4>
                        <p className="text-text-secondary text-xs">18/03/2024 10:30 - Đơn hàng đã được giao thành công</p>
                      </>
                    )}
                    {selectedOrder.status !== "Đã hủy" && (
                      <div className="absolute left-[-11px] top-4 w-[1px] h-[calc(100%+8px)] bg-dark-light"></div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <div className={`absolute left-[-12px] top-1 w-3 h-3 ${selectedOrder.status !== "Đã hủy" ? "bg-gold" : "bg-dark-light"} rounded-full`}></div>
                    {selectedOrder.status !== "Đã hủy" && (
                      <>
                        <h4 className="text-white font-medium text-sm">Đang giao hàng</h4>
                        <p className="text-text-secondary text-xs">17/03/2024 08:00 - Đơn hàng đang được giao đến địa chỉ của bạn</p>
                      </>
                    )}
                    {selectedOrder.status === "Đã hủy" && (
                      <>
                        <h4 className="text-white font-medium text-sm">Đơn hàng đã bị hủy</h4>
                        <p className="text-text-secondary text-xs">06/03/2024 09:30 - Đơn hàng đã bị hủy</p>
                      </>
                    )}
                    <div className="absolute left-[-11px] top-4 w-[1px] h-[calc(100%+8px)] bg-dark-light"></div>
                  </div>
                  
                  <div className="relative">
                    <div className={`absolute left-[-12px] top-1 w-3 h-3 ${selectedOrder.status !== "Đã hủy" ? "bg-gold" : "bg-dark-light"} rounded-full`}></div>
                    <h4 className="text-white font-medium text-sm">Đã xuất kho</h4>
                    <p className="text-text-secondary text-xs">16/03/2024 16:45 - Đơn hàng đã được xuất kho và chuẩn bị giao</p>
                    <div className="absolute left-[-11px] top-4 w-[1px] h-[calc(100%+8px)] bg-dark-light"></div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-[-12px] top-1 w-3 h-3 bg-gold rounded-full"></div>
                    <h4 className="text-white font-medium text-sm">Đang chuẩn bị hàng</h4>
                    <p className="text-text-secondary text-xs">15/03/2024 15:00 - Đơn hàng đang được chuẩn bị</p>
                    <div className="absolute left-[-11px] top-4 w-[1px] h-[calc(100%+8px)] bg-dark-light"></div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-[-12px] top-1 w-3 h-3 bg-gold rounded-full"></div>
                    <h4 className="text-white font-medium text-sm">Đặt hàng thành công</h4>
                    <p className="text-text-secondary text-xs">15/03/2024 14:30 - Đơn hàng đã được đặt thành công</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-dark-light" />

              {/* Order Total */}
              <div>
                <h3 className="flex items-center text-white font-medium mb-4">
                  <Receipt className="h-4 w-4 mr-2 text-gold" />
                  Tổng cộng
                </h3>
                
                <div className="bg-dark-light p-4 rounded-lg">
                  <div className="flex justify-between pb-2">
                    <span className="text-text-secondary">Tạm tính:</span>
                    <span className="text-white">{selectedOrder.total}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-text-secondary">Phí vận chuyển:</span>
                    <span className="text-white">0₫</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-text-secondary">Giảm giá:</span>
                    <span className="text-white">0₫</span>
                  </div>
                  <Separator className="my-2 bg-dark-medium" />
                  <div className="flex justify-between pt-2">
                    <span className="text-white font-medium">Tổng cộng:</span>
                    <span className="text-gold font-bold">{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="border-dark-light w-24">
                Đóng
              </Button>
            </DialogClose>
            {selectedOrder?.status === "Đang giao" && (
              <Button 
                variant="destructive"
                className="w-24"
                onClick={() => {
                  setOrderDetailOpen(false);
                  setCancelOrderOpen(true);
                }}
              >
                Hủy đơn
              </Button>
            )}
            {selectedOrder?.status === "Đã giao" && (
              <Button 
                className="bg-gold hover:bg-gold-hover text-black w-24"
                onClick={() => handleBuyAgain(selectedOrder)}
              >
                Mua lại
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Modal */}
      <Dialog open={cancelOrderOpen} onOpenChange={setCancelOrderOpen}>
        <DialogContent className="bg-dark-medium border-dark-light max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Hủy đơn hàng</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div>
              <h3 className="flex items-center text-white font-medium mb-4">
                <AlertCircle className="h-4 w-4 mr-2 text-gold" />
                Lý do hủy đơn hàng
              </h3>
              
              <div className="space-y-3">
                {['Thay đổi ý định mua hàng', 'Tìm được giá tốt hơn', 'Thời gian giao hàng quá lâu', 'Vấn đề về thanh toán', 'Lý do khác'].map((reason, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-2 bg-dark-light p-3 rounded-lg hover:border-gold hover:border border border-transparent cursor-pointer"
                  >
                    <input 
                      type="radio" 
                      name="cancelReason" 
                      id={`reason${index}`} 
                      className="mt-1 accent-gold"
                    />
                    <label htmlFor={`reason${index}`} className="cursor-pointer flex-1">
                      <div className="text-white font-medium text-sm">{reason}</div>
                      <div className="text-text-secondary text-xs">
                        {index === 0 && "Tôi không còn muốn mua sản phẩm này nữa"}
                        {index === 1 && "Tôi tìm thấy sản phẩm tương tự với giá rẻ hơn ở nơi khác"}
                        {index === 2 && "Thời gian giao hàng không phù hợp với nhu cầu của tôi"}
                        {index === 3 && "Gặp khó khăn trong việc thanh toán đơn hàng"}
                        {index === 4 && "Lý do khác không nằm trong danh sách trên"}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Label htmlFor="cancelNote" className="text-text-secondary mb-2 block">Ghi chú thêm (tùy chọn)</Label>
                <textarea 
                  id="cancelNote" 
                  placeholder="Vui lòng chia sẻ thêm thông tin về lý do hủy đơn hàng..."
                  className="w-full bg-dark-light border-dark-light text-white rounded-lg p-3 min-h-[80px]"
                ></textarea>
              </div>
              
              <div className="mt-4 p-4 bg-red-950/20 border border-red-500/20 rounded-lg flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-text-secondary text-sm">
                  • Đơn hàng sẽ được hủy ngay lập tức và không thể hoàn tác<br />
                  • Tiền sẽ được hoàn lại trong vòng 3-5 ngày làm việc<br />
                  • Bạn có thể đặt lại đơn hàng mới bất cứ lúc nào
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="border-dark-light w-24">
                <X className="h-4 w-4 mr-2" />
                Không hủy
              </Button>
            </DialogClose>
            <Button 
              variant="destructive"
              className="w-24"
              onClick={() => {
                setCancelOrderOpen(false);
                alert('Đơn hàng đã được hủy thành công!');
              }}
            >
              <Check className="h-4 w-4 mr-2" />
              Hủy đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
