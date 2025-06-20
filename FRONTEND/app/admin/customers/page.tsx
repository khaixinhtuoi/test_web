"use client"

import { useState, useEffect } from "react"
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
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter, 
  Users,
  UserPlus,
  Mail,
  Phone,
  Loader2
} from "lucide-react"
import { adminAPI } from "@/lib/api"
import { toast } from "sonner"

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'customer';
  is_active: boolean;
  created_at: string;
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [customerList, setCustomerList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  })
  
  // Tải danh sách khách hàng
  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const { users } = await adminAPI.getAllUsers()
      // Lọc chỉ lấy người dùng có role là customer
      const customerUsers = users.filter((user: User) => user.role === 'customer')
      setCustomerList(customerUsers)
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách hàng:", error)
      toast.error("Không thể tải danh sách khách hàng")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchCustomers()
  }, [])
  
  // Lọc khách hàng dựa trên các bộ lọc
  const filteredCustomers = customerList.filter((customer) => {
    const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase()
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) || 
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm))
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && customer.is_active) ||
      (statusFilter === "inactive" && !customer.is_active)
    
    return matchesSearch && matchesStatus
  })
  
  // Xử lý thêm khách hàng mới
  const handleAddCustomer = async () => {
    try {
      await adminAPI.createUser({
        ...formData,
        role: 'customer' // Đặt role là customer cho khách hàng
      })
      
      toast.success("Thêm khách hàng thành công")
      setIsAddDialogOpen(false)
      resetFormData()
      fetchCustomers() // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi thêm khách hàng:", error)
      toast.error("Không thể thêm khách hàng")
    }
  }
  
  // Xử lý cập nhật khách hàng
  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return
    
    try {
      await adminAPI.updateUser(selectedCustomer._id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address,
        role: 'customer' // Đảm bảo vẫn là customer
      })
      
      toast.success("Cập nhật thông tin khách hàng thành công")
      setIsEditDialogOpen(false)
      fetchCustomers() // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi cập nhật khách hàng:", error)
      toast.error("Không thể cập nhật thông tin khách hàng")
    }
  }
  
  // Xử lý xóa khách hàng
  const handleDeleteCustomerConfirm = async () => {
    if (!selectedCustomer) return
    
    try {
      await adminAPI.deleteUser(selectedCustomer._id)
      
      toast.success("Xóa khách hàng thành công")
      setIsDeleteDialogOpen(false)
      fetchCustomers() // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi xóa khách hàng:", error)
      toast.error("Không thể xóa khách hàng")
    }
  }
  
  // Xử lý cập nhật trạng thái khách hàng
  const handleToggleStatus = async (customer: User) => {
    try {
      await adminAPI.updateUserStatus(customer._id, !customer.is_active)
      
      toast.success(`${customer.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'} tài khoản thành công`)
      fetchCustomers() // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error)
      toast.error("Không thể cập nhật trạng thái khách hàng")
    }
  }
  
  // Xử lý mở dialog chỉnh sửa khách hàng
  const handleEditCustomer = (customer: User) => {
    setSelectedCustomer(customer)
    setFormData({
      email: customer.email,
      password: "", // Không hiển thị mật khẩu
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone || "",
      address: customer.address || "",
    })
    setIsEditDialogOpen(true)
  }
  
  // Xử lý mở dialog xóa khách hàng
  const handleDeleteCustomer = (customer: User) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
    })
  }
  
  // Xử lý thay đổi input form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-500" />
          <h1 className="text-3xl font-bold">Quản lý khách hàng</h1>
        </div>
        <Button 
          onClick={() => {
            resetFormData()
            setIsAddDialogOpen(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm khách hàng
        </Button>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm theo tên, email, số điện thoại..."
                className="bg-gray-700 border-gray-600 text-white pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Đã khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-400">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow>
                  <TableHead className="text-gray-300">Họ tên</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Số điện thoại</TableHead>
                  <TableHead className="text-gray-300">Ngày đăng ký</TableHead>
                  <TableHead className="text-gray-300">Trạng thái</TableHead>
                  <TableHead className="text-gray-300 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      Không tìm thấy khách hàng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer._id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell className="font-medium text-white">
                        {customer.first_name} {customer.last_name}
                      </TableCell>
                      <TableCell className="text-gray-300">{customer.email}</TableCell>
                      <TableCell className="text-gray-300">{customer.phone || "Chưa cập nhật"}</TableCell>
                      <TableCell className="text-gray-300">{formatDate(customer.created_at)}</TableCell>
                      <TableCell>
                        <Badge className={customer.is_active ? "bg-green-500" : "bg-red-500"}>
                          {customer.is_active ? "Đang hoạt động" : "Đã khóa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                            onClick={() => handleToggleStatus(customer)}
                          >
                            <Badge className={customer.is_active ? "bg-red-500" : "bg-green-500"}>
                              {customer.is_active ? "Khóa" : "Mở"}
                            </Badge>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-gray-600 text-red-400 hover:text-red-300 hover:border-red-900"
                            onClick={() => handleDeleteCustomer(customer)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog thêm khách hàng */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Thêm khách hàng mới</DialogTitle>
            <DialogDescription className="text-gray-400">
              Nhập thông tin chi tiết của khách hàng mới
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-gray-300">Tên</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="Nhập tên"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-gray-300">Họ</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Nhập họ"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="example@gmail.com"
                className="bg-gray-700 border-gray-600 text-white"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                className="bg-gray-700 border-gray-600 text-white"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại"
                className="bg-gray-700 border-gray-600 text-white"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-300">Địa chỉ</Label>
              <Input
                id="address"
                name="address"
                placeholder="Nhập địa chỉ"
                className="bg-gray-700 border-gray-600 text-white"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleAddCustomer}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Thêm khách hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog chỉnh sửa khách hàng */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Chỉnh sửa thông tin khách hàng</DialogTitle>
            <DialogDescription className="text-gray-400">
              Cập nhật thông tin chi tiết của khách hàng
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-gray-300">Tên</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="Nhập tên"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-gray-300">Họ</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Nhập họ"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="example@gmail.com"
                className="bg-gray-700 border-gray-600 text-white"
                value={formData.email}
                disabled
              />
              <p className="text-xs text-gray-400">Email không thể thay đổi</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại"
                className="bg-gray-700 border-gray-600 text-white"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-300">Địa chỉ</Label>
              <Input
                id="address"
                name="address"
                placeholder="Nhập địa chỉ"
                className="bg-gray-700 border-gray-600 text-white"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateCustomer}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog xác nhận xóa khách hàng */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Xác nhận xóa khách hàng</DialogTitle>
            <DialogDescription className="text-gray-400">
              Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedCustomer && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-white font-medium">{selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                <p className="text-gray-300">{selectedCustomer.email}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleDeleteCustomerConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa khách hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 