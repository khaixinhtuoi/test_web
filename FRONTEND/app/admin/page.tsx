"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BarChart3, Package, Users, DollarSign, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react"
import { adminOrderAPI, DashboardStats } from "@/lib/api"
import { toast } from "sonner"

export default function AdminDashboard() {
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
      toast.error("Không thể tải dữ liệu dashboard")
    }
  }, [error])

  // Format price function
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

  // Get stats array from API data
  const stats = dashboardData ? [
    {
      title: "Tổng doanh thu",
      value: formatPrice(dashboardData.totalStats.totalRevenue),
      change: dashboardData.totalStats.revenueChange,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Đơn hàng",
      value: formatNumber(dashboardData.totalStats.totalOrders),
      change: dashboardData.totalStats.ordersChange,
      icon: ShoppingCart,
      color: "text-blue-500",
    },
    {
      title: "Sản phẩm",
      value: formatNumber(dashboardData.totalStats.totalProducts),
      change: "+0%",
      icon: Package,
      color: "text-purple-500",
    },
    {
      title: "Khách hàng",
      value: formatNumber(dashboardData.totalStats.totalUsers),
      change: "+0%",
      icon: Users,
      color: "text-yellow-500",
    },
  ] : []

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <SidebarTrigger className="mr-4" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-600 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-gray-600 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-16 bg-gray-600 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          // Error state
          <Card className="bg-gray-800 border-gray-700 col-span-full">
            <CardContent className="flex items-center justify-center py-8">
              <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
              <span className="text-gray-400">Không thể tải dữ liệu thống kê</span>
            </CardContent>
          </Card>
        ) : (
          // Actual data
          stats.map((stat) => (
            <Card key={stat.title} className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-gray-400">
                  <span className={stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-400'}>
                    {stat.change}
                  </span> từ tháng trước
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              // Loading skeleton for chart
              <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="animate-pulse flex items-center">
                  <BarChart3 className="h-16 w-16 text-gray-600" />
                  <span className="ml-4 text-gray-500">Đang tải biểu đồ...</span>
                </div>
              </div>
            ) : error ? (
              // Error state
              <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-16 w-16 text-red-500" />
                <span className="ml-4 text-gray-400">Không thể tải biểu đồ doanh thu</span>
              </div>
            ) : dashboardData?.monthlyRevenue.length === 0 ? (
              // Empty state
              <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-gray-500" />
                <span className="ml-4 text-gray-400">Chưa có dữ liệu doanh thu</span>
              </div>
            ) : (
              // Simple bar chart representation
              <div className="h-64 p-4">
                <div className="h-full flex items-end justify-between space-x-2">
                  {dashboardData?.monthlyRevenue.map((month, index) => {
                    const maxRevenue = Math.max(...(dashboardData?.monthlyRevenue.map(m => m.revenue) || [0]))
                    const height = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0
                    const monthName = new Date(month._id.year, month._id.month - 1).toLocaleDateString('vi-VN', { month: 'short' })

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-orange-500 rounded-t-sm min-h-[4px] transition-all duration-300 hover:bg-orange-400"
                          style={{ height: `${height}%` }}
                          title={`${monthName}: ${formatPrice(month.revenue)}`}
                        ></div>
                        <div className="text-xs text-gray-400 mt-2">{monthName}</div>
                        <div className="text-xs text-gray-500">{formatNumber(month.orders)}</div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">Doanh thu 6 tháng gần nhất</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              // Loading skeleton for recent orders
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <div className="h-4 w-24 bg-gray-600 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-20 bg-gray-600 rounded animate-pulse"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-20 bg-gray-600 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-16 bg-gray-600 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error state
              <div className="flex items-center justify-center py-8">
                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                <span className="text-gray-400">Không thể tải đơn hàng gần đây</span>
              </div>
            ) : dashboardData?.recentOrders.length === 0 ? (
              // Empty state
              <div className="flex items-center justify-center py-8">
                <ShoppingCart className="h-6 w-6 text-gray-500 mr-2" />
                <span className="text-gray-400">Chưa có đơn hàng nào</span>
              </div>
            ) : (
              // Actual data
              <div className="space-y-4">
                {dashboardData?.recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Đơn hàng #{order.order_number}</p>
                      <p className="text-gray-400 text-sm">
                        {order.user_id.first_name} {order.user_id.last_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-medium">{formatPrice(order.total_amount)}</p>
                      <p className="text-gray-400 text-sm">
                        {order.order_status === 'pending' ? 'Đang xử lý' :
                         order.order_status === 'confirmed' ? 'Đã xác nhận' :
                         order.order_status === 'shipping' ? 'Đang giao' :
                         order.order_status === 'delivered' ? 'Đã giao' :
                         order.order_status === 'cancelled' ? 'Đã hủy' : order.order_status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
