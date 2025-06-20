"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Search,
  ShoppingBag,
  Clock,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Truck,
  Edit,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Receipt,
  Save,
  X
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { adminOrderAPI, AdminOrder } from "@/lib/api"
import { toast } from "sonner"

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [page, setPage] = useState(1)

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [orderDetailOpen, setOrderDetailOpen] = useState(false)
  const [editOrderOpen, setEditOrderOpen] = useState(false)

  // Edit form states
  const [editOrderStatus, setEditOrderStatus] = useState("")
  const [editPaymentStatus, setEditPaymentStatus] = useState("")
  const [editNotes, setEditNotes] = useState("")

  const queryClient = useQueryClient()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch orders data
  const { data: ordersData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-orders', page, statusFilter, debouncedSearchTerm],
    queryFn: () => adminOrderAPI.getAllOrders({
      page,
      limit: 10,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: debouncedSearchTerm || undefined
    }),
    retry: 1
  })

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, data }: { orderId: string, data: any }) =>
      adminOrderAPI.updateOrderStatus(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('Cập nhật đơn hàng thành công')
      setEditOrderOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể cập nhật đơn hàng')
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Đang xử lý", variant: "secondary" as const, color: "text-yellow-500" },
      confirmed: { label: "Đã xác nhận", variant: "default" as const, color: "text-blue-500" },
      shipping: { label: "Đang giao", variant: "default" as const, color: "text-purple-500" },
      delivered: { label: "Đã giao", variant: "default" as const, color: "text-green-500" },
      cancelled: { label: "Đã hủy", variant: "destructive" as const, color: "text-red-500" }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getPaymentBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Chưa thanh toán", variant: "secondary" as const },
      paid: { label: "Đã thanh toán", variant: "default" as const },
      failed: { label: "Thất bại", variant: "destructive" as const }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  // Calculate stats
  const orders = ordersData?.orders || []
  const totalOrders = ordersData?.pagination?.total || 0
  const pendingOrders = orders.filter(order => order.order_status === 'pending').length
  const deliveredOrders = orders.filter(order => order.order_status === 'delivered').length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)

  const handleRefresh = () => {
    refetch()
    toast.success("Đã làm mới dữ liệu")
  }

  // Handle view order details
  const handleViewOrderDetail = (order: AdminOrder) => {
    setSelectedOrder(order)
    setOrderDetailOpen(true)
  }

  // Handle edit order
  const handleEditOrder = (order: AdminOrder) => {
    setSelectedOrder(order)
    setEditOrderStatus(order.order_status)
    setEditPaymentStatus(order.payment_status)
    setEditNotes(order.notes || "")
    setEditOrderOpen(true)
  }

  // Handle save order changes
  const handleSaveOrderChanges = () => {
    if (!selectedOrder) return

    const updateData = {
      order_status: editOrderStatus,
      payment_status: editPaymentStatus,
      notes: editNotes
    }

    updateOrderMutation.mutate({
      orderId: selectedOrder._id,
      data: updateData
    })
  }

  // Handle error
  useEffect(() => {
    if (error) {
      toast.error("Không thể tải dữ liệu đơn hàng")
    }
  }, [error])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <ShoppingBag className="h-6 w-6 mr-2 text-orange-500" />
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-white">{totalOrders}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Đang xử lý</p>
                <p className="text-2xl font-bold text-yellow-500">{pendingOrders}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div>
              <p className="text-gray-400 text-sm">Đã giao hàng</p>
              <p className="text-2xl font-bold text-green-500">{deliveredOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div>
              <p className="text-gray-400 text-sm">Doanh thu</p>
              <p className="text-2xl font-bold text-orange-500">{formatPrice(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm theo mã đơn, tên khách hàng..."
                className="bg-gray-700 border-gray-600 text-white pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Trạng thái đơn hàng" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Đang xử lý</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="shipping">Đang giao hàng</SelectItem>
                <SelectItem value="delivered">Đã giao hàng</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Trạng thái thanh toán" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="pending">Chưa thanh toán</SelectItem>
                <SelectItem value="failed">Thanh toán thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow className="border-gray-700 hover:bg-gray-900">
                <TableHead className="text-gray-400">Mã ĐH</TableHead>
                <TableHead className="text-gray-400">Khách hàng</TableHead>
                <TableHead className="text-gray-400">Ngày đặt</TableHead>
                <TableHead className="text-gray-400">Tổng tiền</TableHead>
                <TableHead className="text-gray-400">Trạng thái</TableHead>
                <TableHead className="text-gray-400">Thanh toán</TableHead>
                <TableHead className="text-gray-400 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow className="border-gray-700">
                  <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                    {isLoading ? "Đang tải..." : "Chưa có đơn hàng nào"}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id} className="border-gray-700 hover:bg-gray-800">
                    <TableCell className="text-white font-mono">
                      {order.order_number}
                    </TableCell>
                    <TableCell className="text-white">
                      <div>
                        <p className="font-medium">
                          {order.user_id.first_name} {order.user_id.last_name}
                        </p>
                        <p className="text-sm text-gray-400">{order.user_id.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {formatPrice(order.total_amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.order_status)}
                    </TableCell>
                    <TableCell>
                      {getPaymentBadge(order.payment_status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                          onClick={() => handleViewOrderDetail(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                          onClick={() => handleEditOrder(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              {selectedOrder ? `Chi tiết đơn hàng #${selectedOrder.order_number}` : 'Chi tiết đơn hàng'}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Mã đơn hàng</div>
                  <div className="text-white font-medium">#{selectedOrder.order_number}</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Ngày đặt hàng</div>
                  <div className="text-white font-medium">{formatDate(selectedOrder.created_at)}</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Trạng thái</div>
                  <div>{getStatusBadge(selectedOrder.order_status)}</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Thanh toán</div>
                  <div>{getPaymentBadge(selectedOrder.payment_status)}</div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Customer Information */}
              <div>
                <h3 className="flex items-center text-white font-medium mb-4">
                  <User className="h-4 w-4 mr-2 text-orange-500" />
                  Thông tin khách hàng
                </h3>
                <div className="bg-gray-700 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Họ tên</div>
                    <div className="text-white">{selectedOrder.user_id.first_name} {selectedOrder.user_id.last_name}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Email</div>
                    <div className="text-white">{selectedOrder.user_id.email}</div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Shipping Information */}
              <div>
                <h3 className="flex items-center text-white font-medium mb-4">
                  <Truck className="h-4 w-4 mr-2 text-orange-500" />
                  Thông tin giao hàng
                </h3>
                <div className="bg-gray-700 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Người nhận</div>
                    <div className="text-white">{selectedOrder.shipping_recipient_name}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Phí giao hàng</div>
                    <div className="text-white">{formatPrice(selectedOrder.shipping_fee)}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Địa chỉ giao hàng</div>
                    <div className="text-white">{selectedOrder.shipping_address}</div>
                  </div>
                  {selectedOrder.notes && (
                    <div className="md:col-span-2">
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Ghi chú</div>
                      <div className="text-white">{selectedOrder.notes}</div>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Order Total */}
              <div>
                <h3 className="flex items-center text-white font-medium mb-4">
                  <Receipt className="h-4 w-4 mr-2 text-orange-500" />
                  Tổng cộng
                </h3>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-400">Tạm tính:</span>
                    <span className="text-white">{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-400">Phí vận chuyển:</span>
                    <span className="text-white">{formatPrice(selectedOrder.shipping_fee)}</span>
                  </div>
                  <Separator className="my-2 bg-gray-600" />
                  <div className="flex justify-between pt-2">
                    <span className="text-white font-medium">Tổng cộng:</span>
                    <span className="text-orange-500 font-bold">{formatPrice(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-600 text-gray-300">
                Đóng
              </Button>
            </DialogClose>
            {selectedOrder && (
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  setOrderDetailOpen(false)
                  handleEditOrder(selectedOrder)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog open={editOrderOpen} onOpenChange={setEditOrderOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              {selectedOrder ? `Chỉnh sửa đơn hàng #${selectedOrder.order_number}` : 'Chỉnh sửa đơn hàng'}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <div className="space-y-2">
                <Label htmlFor="orderStatus" className="text-gray-300">
                  Trạng thái đơn hàng
                </Label>
                <Select value={editOrderStatus} onValueChange={setEditOrderStatus}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Chọn trạng thái đơn hàng" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="pending">Đang xử lý</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="shipping">Đang giao hàng</SelectItem>
                    <SelectItem value="delivered">Đã giao hàng</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status */}
              <div className="space-y-2">
                <Label htmlFor="paymentStatus" className="text-gray-300">
                  Trạng thái thanh toán
                </Label>
                <Select value={editPaymentStatus} onValueChange={setEditPaymentStatus}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Chọn trạng thái thanh toán" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="pending">Chưa thanh toán</SelectItem>
                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                    <SelectItem value="failed">Thanh toán thất bại</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-300">
                  Ghi chú
                </Label>
                <Textarea
                  id="notes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Thêm ghi chú cho đơn hàng..."
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Thông tin đơn hàng</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Khách hàng:</span>
                    <span className="text-white">{selectedOrder.user_id.first_name} {selectedOrder.user_id.last_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tổng tiền:</span>
                    <span className="text-white font-medium">{formatPrice(selectedOrder.total_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phương thức thanh toán:</span>
                    <span className="text-white">
                      {selectedOrder.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' :
                       selectedOrder.payment_method === 'bank' ? 'Chuyển khoản ngân hàng' :
                       selectedOrder.payment_method === 'momo' ? 'Ví MoMo' : selectedOrder.payment_method}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-600 text-gray-300">
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
            </DialogClose>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSaveOrderChanges}
              disabled={updateOrderMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateOrderMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
