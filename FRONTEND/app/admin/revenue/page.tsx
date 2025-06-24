"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { adminOrderAPI } from "@/lib/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Download, 
  TrendingUp, 
  ShoppingBag, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search
} from "lucide-react"

// Dữ liệu mẫu cho biểu đồ doanh thu theo tháng
const revenueData = [
  { month: "T1", doanhthu: 45000000, donhang: 120 },
  { month: "T2", doanhthu: 52000000, donhang: 145 },
  { month: "T3", doanhthu: 48000000, donhang: 132 },
  { month: "T4", doanhthu: 61000000, donhang: 168 },
  { month: "T5", doanhthu: 58000000, donhang: 154 },
  { month: "T6", doanhthu: 65000000, donhang: 172 },
  { month: "T7", doanhthu: 68000000, donhang: 183 },
  { month: "T8", doanhthu: 72000000, donhang: 196 },
  { month: "T9", doanhthu: 69000000, donhang: 178 },
  { month: "T10", doanhthu: 78000000, donhang: 210 },
  { month: "T11", doanhthu: 82000000, donhang: 225 },
  { month: "T12", doanhthu: 95000000, donhang: 256 },
]

// Dữ liệu mẫu cho danh sách sản phẩm bán chạy
const topProducts = [
  { id: "SP001", name: "Laptop Gaming Asus ROG", quantity: 45, revenue: 135000000 },
  { id: "SP002", name: "iPhone 15 Pro Max", quantity: 38, revenue: 152000000 },
  { id: "SP003", name: "Tai nghe Sony WH-1000XM5", quantity: 65, revenue: 97500000 },
  { id: "SP004", name: "Samsung Galaxy S23 Ultra", quantity: 32, revenue: 96000000 },
  { id: "SP005", name: "iPad Pro M2", quantity: 28, revenue: 84000000 },
]

// Dữ liệu mẫu cho thống kê theo danh mục
const categoryData = [
  { name: "Điện thoại", value: 35 },
  { name: "Laptop", value: 25 },
  { name: "Phụ kiện", value: 20 },
  { name: "Máy tính bảng", value: 15 },
  { name: "Khác", value: 5 },
]

export default function RevenuePage() {
  const [yearFilter, setYearFilter] = useState("2024")

  // Fetch dashboard stats
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: adminOrderAPI.getDashboardStats,
    retry: 1,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  })

  // Handle error
  useEffect(() => {
    if (error) {
      toast.error("Không thể tải dữ liệu doanh thu")
    }
  }, [error])

  // Định dạng số tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  // Format number function
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num)
  }

  // Prepare chart data from API
  const chartData = dashboardData?.monthlyRevenue?.map(item => ({
    month: `T${item._id.month}`,
    doanhthu: item.revenue,
    donhang: item.orders
  })) || []

  // Calculate totals from API data
  const totalRevenue = dashboardData?.totalStats?.totalRevenue || 0
  const totalOrders = dashboardData?.totalStats?.totalOrders || 0
  const totalProducts = dashboardData?.totalStats?.totalProducts || 0
  const totalUsers = dashboardData?.totalStats?.totalUsers || 0

  // Tính doanh thu trung bình mỗi đơn hàng
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Đang tải dữ liệu doanh thu...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Không thể tải dữ liệu doanh thu</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-green-500" />
          <h1 className="text-3xl font-bold">Thống kê doanh thu</h1>
          <span className="ml-3 text-sm text-gray-400">(Chỉ tính đơn hàng đã thanh toán)</span>
        </div>
        <div className="flex gap-2">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="2022">Năm 2022</SelectItem>
              <SelectItem value="2023">Năm 2023</SelectItem>
              <SelectItem value="2024">Năm 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>
      
      {/* Thẻ tổng quan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatPrice(totalRevenue)}</div>
            <div className="flex items-center pt-1 text-sm text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>{dashboardData?.totalStats?.revenueChange || "+0%"} so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingBag className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(totalOrders)}</div>
            <div className="flex items-center pt-1 text-sm text-blue-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>{dashboardData?.totalStats?.ordersChange || "+0%"} so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg font-medium">Giá trị đơn trung bình</CardTitle>
            <CreditCard className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatPrice(averageOrderValue)}</div>
            <div className="flex items-center pt-1 text-sm text-purple-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>Giá trị trung bình mỗi đơn hàng</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg font-medium">Tổng sản phẩm</CardTitle>
            <ShoppingBag className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(totalProducts)}</div>
            <div className="flex items-center pt-1 text-sm text-orange-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>Sản phẩm trong hệ thống</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg font-medium">Tổng khách hàng</CardTitle>
            <Users className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(totalUsers)}</div>
            <div className="flex items-center pt-1 text-sm text-yellow-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>Khách hàng đã đăng ký</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Biểu đồ và thống kê */}
      <div className="grid gap-4 md:grid-cols-7 mb-6">
        <Card className="md:col-span-5 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Biểu đồ doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <Tabs defaultValue="line" className="w-full">
              <div className="flex justify-between items-center px-4">
                <TabsList className="bg-gray-700">
                  <TabsTrigger value="line" className="data-[state=active]:bg-gray-600">Đường</TabsTrigger>
                  <TabsTrigger value="bar" className="data-[state=active]:bg-gray-600">Cột</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="line" className="mt-4">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis 
                      stroke="#9CA3AF"
                      tickFormatter={(value) => `${value / 1000000}tr`}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatPrice(value)}
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="doanhthu" 
                      name="Doanh thu" 
                      stroke="#10B981" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="bar" className="mt-4">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis 
                      stroke="#9CA3AF"
                      tickFormatter={(value) => `${value / 1000000}tr`}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatPrice(value)}
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                    />
                    <Legend />
                    <Bar dataKey="doanhthu" name="Doanh thu" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Phân bố theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center">
                  <div className="w-[35%] text-sm text-gray-300">{category.name}</div>
                  <div className="w-[45%]">
                    <div className="h-2 w-full rounded-full bg-gray-700">
                      <div 
                        className="h-2 rounded-full bg-green-500" 
                        style={{ width: `${category.value}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-[20%] text-right text-sm text-gray-300">{category.value}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sản phẩm bán chạy */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Sản phẩm bán chạy</CardTitle>
          <CardDescription className="text-gray-400">
            Top 5 sản phẩm có doanh thu cao nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow className="border-gray-700 hover:bg-gray-900">
                <TableHead className="text-gray-400">Mã SP</TableHead>
                <TableHead className="text-gray-400">Tên sản phẩm</TableHead>
                <TableHead className="text-gray-400 text-right">Số lượng bán</TableHead>
                <TableHead className="text-gray-400 text-right">Doanh thu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.id} className="border-gray-700 hover:bg-gray-700">
                  <TableCell className="font-medium text-white">{product.id}</TableCell>
                  <TableCell className="text-white">{product.name}</TableCell>
                  <TableCell className="text-gray-300 text-right">{product.quantity}</TableCell>
                  <TableCell className="text-green-500 font-medium text-right">
                    {formatPrice(product.revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 