import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BarChart3, Package, Users, DollarSign, ShoppingCart } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "2.4 tỷ ₫",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Đơn hàng",
      value: "1,234",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-500",
    },
    {
      title: "Sản phẩm",
      value: "856",
      change: "+3.1%",
      icon: Package,
      color: "text-purple-500",
    },
    {
      title: "Khách hàng",
      value: "12,345",
      change: "+15.3%",
      icon: Users,
      color: "text-yellow-500",
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <SidebarTrigger className="mr-4" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-gray-400">
                <span className={stat.color}>{stat.change}</span> từ tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-gray-500" />
              <span className="ml-4 text-gray-400">Biểu đồ doanh thu</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Đơn hàng #{1000 + i}</p>
                    <p className="text-gray-400 text-sm">Nguyễn Văn A</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-medium">2.500.000₫</p>
                    <p className="text-gray-400 text-sm">Đang xử lý</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
