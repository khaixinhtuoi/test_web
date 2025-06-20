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
  UserCheck, 
  Mail,
  Phone,
  Calendar,
  MapPin,
  UserPlus,
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

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null)
  const [staffList, setStaffList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  })
  
  // Tải danh sách nhân viên (admin)
  const fetchStaff = async () => {
    try {
      setIsLoading(true)
      const { users } = await adminAPI.getAllUsers()
      // Lọc chỉ lấy người dùng có role là admin
      const adminUsers = users.filter((user: User) => user.role === 'admin')
      setStaffList(adminUsers)
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhân viên:", error)
      toast.error("Không thể tải danh sách nhân viên")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchStaff()
  }, [])
  
  // Lọc nhân viên dựa trên các bộ lọc
  const filteredStaff = staffList.filter((staff) => {
    const fullName = `${staff.first_name} ${staff.last_name}`.toLowerCase()
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) || 
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.phone && staff.phone.includes(searchTerm))
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && staff.is_active) ||
      (statusFilter === "inactive" && !staff.is_active)
    
    return matchesSearch && matchesStatus
  })
  
  // Xử lý thêm nhân viên mới
  const handleAddStaff = async () => {
    try {
      await adminAPI.createUser({
        ...formData,
        role: 'admin' // Đặt role là admin cho nhân viên
      })
      
      toast.success("Thêm nhân viên thành công")
      setIsAddDialogOpen(false)
      resetFormData()
      fetchStaff() // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error)
      toast.error("Không thể thêm nhân viên")
    }
  }
  
  // Xử lý cập nhật nhân viên
  const handleUpdateStaff = async () => {
    if (!selectedStaff) return
    
    try {
      await adminAPI.updateUser(selectedStaff._id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address,
        role: 'admin' // Đảm bảo vẫn là admin
      })
      
      toast.success("Cập nhật thông tin nhân viên thành công")
      setIsEditDialogOpen(false)
      fetchStaff() // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi cập nhật nhân viên:", error)
      toast.error("Không thể cập nhật thông tin nhân viên")
    }
  }
  
  // Xử lý xóa nhân viên
  const handleDeleteStaffConfirm = async () => {
    if (!selectedStaff) return
    
    try {
      await adminAPI.deleteUser(selectedStaff._id)
      
      toast.success("Xóa nhân viên thành công")
      setIsDeleteDialogOpen(false)
      fetchStaff() // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error)
      toast.error("Không thể xóa nhân viên")
    }
  }
  
  // Xử lý cập nhật trạng thái nhân viên
  const handleToggleStatus = async (staff: User) => {
    try {
      await adminAPI.updateUserStatus(staff._id, !staff.is_active)
      
      toast.success(`${staff.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'} tài khoản thành công`)
      fetchStaff() // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error)
      toast.error("Không thể cập nhật trạng thái nhân viên")
    }
  }
  
  // Xử lý mở dialog chỉnh sửa nhân viên
  const handleEditStaff = (staff: User) => {
    setSelectedStaff(staff)
    setFormData({
      email: staff.email,
      password: "", // Không hiển thị mật khẩu
      first_name: staff.first_name,
      last_name: staff.last_name,
      phone: staff.phone || "",
      address: staff.address || "",
    })
    setIsEditDialogOpen(true)
  }
  
  // Xử lý mở dialog xóa nhân viên
  const handleDeleteStaff = (staff: User) => {
    setSelectedStaff(staff)
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
          <UserCheck className="h-6 w-6 mr-2 text-purple-500" />
          <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
        </div>
        <Button 
          onClick={() => {
            resetFormData()
            setIsAddDialogOpen(true)
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm nhân viên
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
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              <span className="ml-2 text-gray-400">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow>
                  <TableHead className="text-gray-300">Họ tên</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Số điện thoại</TableHead>
                  <TableHead className="text-gray-300">Ngày tham gia</TableHead>
                  <TableHead className="text-gray-300">Trạng thái</TableHead>
                  <TableHead className="text-gray-300 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      Không tìm thấy nhân viên nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((staff) => (
                    <TableRow key={staff._id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell className="font-medium text-white">
                        {staff.first_name} {staff.last_name}
                      </TableCell>
                      <TableCell className="text-gray-300">{staff.email}</TableCell>
                      <TableCell className="text-gray-300">{staff.phone || "Chưa cập nhật"}</TableCell>
                      <TableCell className="text-gray-300">{formatDate(staff.created_at)}</TableCell>
                      <TableCell>
                        <Badge className={staff.is_active ? "bg-green-500" : "bg-red-500"}>
                          {staff.is_active ? "Đang hoạt động" : "Đã khóa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                            onClick={() => handleEditStaff(staff)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                            onClick={() => handleToggleStatus(staff)}
                          >
                            <Badge className={staff.is_active ? "bg-red-500" : "bg-green-500"}>
                              {staff.is_active ? "Khóa" : "Mở"}
                            </Badge>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-gray-600 text-red-400 hover:text-red-300 hover:border-red-900"
                            onClick={() => handleDeleteStaff(staff)}
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
      
      {/* Dialog thêm nhân viên */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Thêm nhân viên mới</DialogTitle>
            <DialogDescription className="text-gray-400">
              Nhập thông tin chi tiết của nhân viên mới
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
                placeholder="example@techstore.com"
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
              onClick={handleAddStaff}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Thêm nhân viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog chỉnh sửa nhân viên */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Chỉnh sửa thông tin nhân viên</DialogTitle>
            <DialogDescription className="text-gray-400">
              Cập nhật thông tin chi tiết của nhân viên
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
                placeholder="example@techstore.com"
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
              onClick={handleUpdateStaff}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog xác nhận xóa nhân viên */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Xác nhận xóa nhân viên</DialogTitle>
            <DialogDescription className="text-gray-400">
              Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedStaff && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-white font-medium">{selectedStaff.first_name} {selectedStaff.last_name}</p>
                <p className="text-gray-300">{selectedStaff.email}</p>
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
              onClick={handleDeleteStaffConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa nhân viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 