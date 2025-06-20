"use client"

import { useState } from "react"
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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Package, 
  Truck,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
  Trash2
} from "lucide-react"

// Dữ liệu mẫu cho đơn hàng
const sampleOrders = [
  {
    id: "DH001",
    customerName: "Nguyễn Văn An",
    customerEmail: "nguyenvanan@gmail.com",
    date: "15/11/2023",
    total: 15800000,
    status: "Đã giao hàng",
    paymentStatus: "Đã thanh toán",
    paymentMethod: "Thẻ tín dụng",
    items: [
      { id: "SP001", name: "Laptop Gaming Asus ROG", price: 32000000, quantity: 1 },
      { id: "SP003", name: "Tai nghe Sony WH-1000XM5", price: 8500000, quantity: 1 },
    ],
    shippingAddress: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    trackingNumber: "VN123456789",
  },
  {
    id: "DH002",
    customerName: "Trần Thị Bình",
    customerEmail: "tranthibinh@gmail.com",
    date: "18/11/2023",
    total: 24500000,
    status: "Đang giao hàng",
    paymentStatus: "Đã thanh toán",
    paymentMethod: "Chuyển khoản",
    items: [
      { id: "SP002", name: "iPhone 15 Pro Max", price: 24500000, quantity: 1 },
    ],
    shippingAddress: "45 Lê Lợi, Quận 1, TP.HCM",
    trackingNumber: "VN987654321",
  },
  {
    id: "DH003",
    customerName: "Lê Văn Cường",
    customerEmail: "levancuong@gmail.com",
    date: "20/11/2023",
    total: 8500000,
    status: "Đang xử lý",
    paymentStatus: "Chưa thanh toán",
    paymentMethod: "COD",
    items: [
      { id: "SP003", name: "Tai nghe Sony WH-1000XM5", price: 8500000, quantity: 1 },
    ],
    shippingAddress: "78 Nguyễn Huệ, Quận 1, TP.HCM",
    trackingNumber: "",
  },
  {
    id: "DH004",
    customerName: "Phạm Thị Dung",
    customerEmail: "phamthidung@gmail.com",
    date: "22/11/2023",
    total: 30000000,
    status: "Đã xác nhận",
    paymentStatus: "Đã thanh toán",
    paymentMethod: "Ví điện tử",
    items: [
      { id: "SP004", name: "Samsung Galaxy S23 Ultra", price: 30000000, quantity: 1 },
    ],
    shippingAddress: "56 Điện Biên Phủ, Quận 3, TP.HCM",
    trackingNumber: "VN456789123",
  },
  {
    id: "DH005",
    customerName: "Hoàng Văn Em",
    customerEmail: "hoangvanem@gmail.com",
    date: "25/11/2023",
    total: 40500000,
    status: "Đã hủy",
    paymentStatus: "Hoàn tiền",
    paymentMethod: "Thẻ tín dụng",
    items: [
      { id: "SP005", name: "iPad Pro M2", price: 25000000, quantity: 1 },
      { id: "SP003", name: "Tai nghe Sony WH-1000XM5", price: 8500000, quantity: 1 },
      { id: "SP006", name: "Apple Watch Series 9", price: 7000000, quantity: 1 },
    ],
    shippingAddress: "34 Cách Mạng Tháng 8, Quận 3, TP.HCM",
    trackingNumber: "",
  },
  {
    id: "DH006",
    customerName: "Ngô Thị Phương",
    customerEmail: "ngothiphuong@gmail.com",
    date: "28/11/2023",
    total: 32000000,
    status: "Đã giao hàng",
    paymentStatus: "Đã thanh toán",
    paymentMethod: "Chuyển khoản",
    items: [
      { id: "SP001", name: "Laptop Gaming Asus ROG", price: 32000000, quantity: 1 },
    ],
    shippingAddress: "89 Nguyễn Đình Chiểu, Quận 3, TP.HCM",
    trackingNumber: "VN789123456",
  },
]

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [editedOrder, setEditedOrder] = useState<any>(null)
  
  // Lọc đơn hàng dựa trên các bộ lọc
  const filteredOrders = sampleOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })
  
  // Định dạng số tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }
  
  // Xử lý mở dialog xem chi tiết đơn hàng
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }
  
  // Xử lý mở dialog chỉnh sửa đơn hàng
  const handleEditOrder = (order: any) => {
    setSelectedOrder(order)
    setEditedOrder({...order})
    setIsEditDialogOpen(true)
  }
  
  // Xử lý lưu thay đổi đơn hàng
  const handleSaveOrder = () => {
    // Trong thực tế, ở đây sẽ gọi API để lưu thay đổi
    // Hiện tại chỉ đóng dialog
    setIsEditDialogOpen(false)
  }
  
  // Xử lý thay đổi trạng thái đơn hàng
  const handleStatusChange = (value: string) => {
    setEditedOrder({...editedOrder, status: value})
  }
  
  // Xử lý thay đổi trạng thái thanh toán
  const handlePaymentStatusChange = (value: string) => {
    setEditedOrder({...editedOrder, paymentStatus: value})
  }
  
  // Xử lý thay đổi số lượng sản phẩm
  const handleQuantityChange = (index: number, value: number) => {
    const updatedItems = [...editedOrder.items]
    updatedItems[index].quantity = value
    
    // Tính lại tổng tiền
    const newTotal = updatedItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    )
    
    setEditedOrder({
      ...editedOrder,
      items: updatedItems,
      total: newTotal
    })
  }
  
  // Xác định màu sắc cho badge trạng thái đơn hàng
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã giao hàng":
        return "bg-green-500 hover:bg-green-600"
      case "Đang giao hàng":
        return "bg-blue-500 hover:bg-blue-600"
      case "Đang xử lý":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Đã xác nhận":
        return "bg-purple-500 hover:bg-purple-600"
      case "Đã hủy":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }
  
  // Xác định màu sắc cho badge trạng thái thanh toán
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Đã thanh toán":
        return "bg-green-500 hover:bg-green-600"
      case "Chưa thanh toán":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Hoàn tiền":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }
  
  // Xác định icon cho trạng thái đơn hàng
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Đã giao hàng":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Đang giao hàng":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "Đang xử lý":
        return <Package className="h-5 w-5 text-yellow-500" />
      case "Đã xác nhận":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "Đã hủy":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <ShoppingBag className="h-6 w-6 mr-2 text-orange-500" />
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
        </div>
      </div>
      
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
                <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                <SelectItem value="Đã xác nhận">Đã xác nhận</SelectItem>
                <SelectItem value="Đang giao hàng">Đang giao hàng</SelectItem>
                <SelectItem value="Đã giao hàng">Đã giao hàng</SelectItem>
                <SelectItem value="Đã hủy">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Trạng thái thanh toán" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
                <SelectItem value="Hoàn tiền">Hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
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
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-gray-700 hover:bg-gray-700">
                  <TableCell className="font-medium text-white">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{order.customerName}</div>
                      <div className="text-sm text-gray-400">{order.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{order.date}</TableCell>
                  <TableCell className="text-orange-500 font-medium">{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-600"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 border-gray-600 text-blue-400 hover:text-white hover:bg-blue-900 hover:border-blue-700"
                        onClick={() => handleEditOrder(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredOrders.length === 0 && (
                <TableRow className="border-gray-700">
                  <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                    Không tìm thấy đơn hàng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="mt-4 flex justify-between items-center text-gray-400">
        <div>Hiển thị 1-6 trong tổng số {filteredOrders.length} đơn hàng</div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      
      {/* Dialog xem chi tiết đơn hàng */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center">
              {selectedOrder && getStatusIcon(selectedOrder.status)}
              <span className="ml-2">Chi tiết đơn hàng {selectedOrder?.id}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Thông tin chi tiết về đơn hàng và trạng thái
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thông tin đơn hàng */}
                <div className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Thông tin đơn hàng
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mã đơn hàng:</span>
                        <span className="text-white font-medium">{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ngày đặt:</span>
                        <span className="text-white">{selectedOrder.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Trạng thái:</span>
                        <Badge className={getStatusColor(selectedOrder.status)}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phương thức thanh toán:</span>
                        <span className="text-white">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Trạng thái thanh toán:</span>
                        <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Mã vận đơn:</span>
                          <span className="text-white">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      Thông tin khách hàng
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tên khách hàng:</span>
                        <span className="text-white">{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedOrder.customerEmail}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      Địa chỉ giao hàng
                    </h3>
                    <p className="text-sm text-white">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>
                
                {/* Chi tiết sản phẩm */}
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    Chi tiết sản phẩm
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between border-b border-gray-600 pb-2 last:border-0">
                        <div>
                          <div className="text-white">{item.name}</div>
                          <div className="text-sm text-gray-400">SL: {item.quantity}</div>
                        </div>
                        <div className="text-right text-orange-500 font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-2 mt-2 border-t border-gray-600">
                      <div className="flex justify-between text-gray-400">
                        <span>Tổng sản phẩm:</span>
                        <span>{selectedOrder.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} sản phẩm</span>
                      </div>
                      <div className="flex justify-between font-medium text-white mt-2">
                        <span>Tổng tiền:</span>
                        <span className="text-orange-500">{formatPrice(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    In hóa đơn
                  </Button>
                </div>
                <Button 
                  onClick={() => setIsViewDialogOpen(false)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog chỉnh sửa đơn hàng */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center">
              <Edit className="h-5 w-5 mr-2 text-blue-500" />
              <span>Chỉnh sửa đơn hàng {selectedOrder?.id}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Cập nhật thông tin đơn hàng và trạng thái
            </DialogDescription>
          </DialogHeader>
          
          {editedOrder && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thông tin đơn hàng */}
                <div className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Thông tin đơn hàng
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="orderStatus" className="text-gray-300 mb-1 block">
                          Trạng thái đơn hàng
                        </Label>
                        <Select value={editedOrder.status} onValueChange={handleStatusChange}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                            <SelectItem value="Đã xác nhận">Đã xác nhận</SelectItem>
                            <SelectItem value="Đang giao hàng">Đang giao hàng</SelectItem>
                            <SelectItem value="Đã giao hàng">Đã giao hàng</SelectItem>
                            <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="paymentStatus" className="text-gray-300 mb-1 block">
                          Trạng thái thanh toán
                        </Label>
                        <Select value={editedOrder.paymentStatus} onValueChange={handlePaymentStatusChange}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                            <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
                            <SelectItem value="Hoàn tiền">Hoàn tiền</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="trackingNumber" className="text-gray-300 mb-1 block">
                          Mã vận đơn
                        </Label>
                        <Input
                          id="trackingNumber"
                          value={editedOrder.trackingNumber || ""}
                          onChange={(e) => setEditedOrder({...editedOrder, trackingNumber: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Nhập mã vận đơn"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      Thông tin khách hàng
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tên khách hàng:</span>
                        <span className="text-white">{editedOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{editedOrder.customerEmail}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      Địa chỉ giao hàng
                    </h3>
                    <textarea
                      value={editedOrder.shippingAddress}
                      onChange={(e) => setEditedOrder({...editedOrder, shippingAddress: e.target.value})}
                      className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2 text-sm"
                      rows={2}
                    />
                  </div>
                </div>
                
                {/* Chi tiết sản phẩm */}
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    Chi tiết sản phẩm
                  </h3>
                  <div className="space-y-3">
                    {editedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between border-b border-gray-600 pb-2 last:border-0">
                        <div className="flex-1">
                          <div className="text-white">{item.name}</div>
                          <div className="text-sm text-gray-400">Đơn giá: {formatPrice(item.price)}</div>
                        </div>
                        <div className="flex items-center">
                          <Label className="text-gray-400 mr-2">SL:</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                            className="w-16 h-8 bg-gray-700 border-gray-600 text-white text-center"
                          />
                        </div>
                        <div className="text-right text-orange-500 font-medium ml-4 w-28">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-2 mt-2 border-t border-gray-600">
                      <div className="flex justify-between text-gray-400">
                        <span>Tổng sản phẩm:</span>
                        <span>{editedOrder.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} sản phẩm</span>
                      </div>
                      <div className="flex justify-between font-medium text-white mt-2">
                        <span>Tổng tiền:</span>
                        <span className="text-orange-500">{formatPrice(editedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSaveOrder}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}