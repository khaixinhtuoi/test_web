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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  Edit, 
  Trash2, 
  FolderTree,
  Plus,
  Loader2
} from "lucide-react"
import { adminAPI } from "@/lib/api"
import { toast } from "sonner"

// Định nghĩa kiểu dữ liệu cho danh mục
interface Category {
  _id: string;
  category_name: string;
  is_active: boolean;
  created_at: string;
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryName, setCategoryName] = useState("")
  
  // Tải danh sách danh mục
  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const { categories } = await adminAPI.getAllCategories()
      setCategoryList(categories)
    } catch (error) {
      console.error("Lỗi khi tải danh sách danh mục:", error)
      toast.error("Không thể tải danh sách danh mục")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchCategories()
  }, [])
  
  // Lọc danh mục dựa trên từ khóa tìm kiếm
  const filteredCategories = categoryList.filter((category) => {
    return category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  })
  
  // Xử lý thêm danh mục mới
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Vui lòng nhập tên danh mục")
      return
    }
    
    try {
      await adminAPI.createCategory({
        category_name: categoryName.trim()
      })
      
      toast.success("Thêm danh mục thành công")
      setIsAddDialogOpen(false)
      setCategoryName("")
      fetchCategories() // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error)
      toast.error("Không thể thêm danh mục")
    }
  }
  
  // Xử lý cập nhật danh mục
  const handleUpdateCategory = async () => {
    if (!selectedCategory) return
    
    if (!categoryName.trim()) {
      toast.error("Vui lòng nhập tên danh mục")
      return
    }
    
    try {
      await adminAPI.updateCategory(selectedCategory._id, {
        category_name: categoryName.trim()
      })
      
      toast.success("Cập nhật danh mục thành công")
      setIsEditDialogOpen(false)
      fetchCategories() // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error)
      toast.error("Không thể cập nhật danh mục")
    }
  }
  
  // Xử lý cập nhật trạng thái danh mục
  const handleToggleStatus = async (category: Category) => {
    try {
      await adminAPI.updateCategoryStatus(category._id, !category.is_active)
      
      toast.success(`${category.is_active ? 'Ẩn' : 'Hiện'} danh mục thành công`)
      fetchCategories() // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái danh mục:", error)
      toast.error("Không thể cập nhật trạng thái danh mục")
    }
  }
  
  // Xử lý mở dialog chỉnh sửa danh mục
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setCategoryName(category.category_name)
    setIsEditDialogOpen(true)
  }
  
  // Xử lý mở dialog xóa danh mục
  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
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
          <FolderTree className="h-6 w-6 mr-2 text-green-500" />
          <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        </div>
        <Button 
          onClick={() => {
            setCategoryName("")
            setIsAddDialogOpen(true)
          }}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo tên danh mục..."
              className="bg-gray-700 border-gray-600 text-white pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
              <span className="ml-2 text-gray-400">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow>
                  <TableHead className="text-gray-300">Tên danh mục</TableHead>
                  <TableHead className="text-gray-300">Ngày tạo</TableHead>
                  <TableHead className="text-gray-300">Trạng thái</TableHead>
                  <TableHead className="text-gray-300 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                      Không tìm thấy danh mục nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category._id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell className="font-medium text-white">
                        {category.category_name}
                      </TableCell>
                      <TableCell className="text-gray-300">{formatDate(category.created_at)}</TableCell>
                      <TableCell>
                        <Badge className={category.is_active ? "bg-green-500" : "bg-red-500"}>
                          {category.is_active ? "Đang hiển thị" : "Đã ẩn"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                            onClick={() => handleToggleStatus(category)}
                          >
                            <Badge className={category.is_active ? "bg-red-500" : "bg-green-500"}>
                              {category.is_active ? "Ẩn" : "Hiện"}
                            </Badge>
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
      
      {/* Dialog thêm danh mục */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Thêm danh mục mới</DialogTitle>
            <DialogDescription className="text-gray-400">
              Nhập tên danh mục mới
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="category_name" className="text-gray-300">Tên danh mục</Label>
              <Input
                id="category_name"
                placeholder="Nhập tên danh mục"
                className="bg-gray-700 border-gray-600 text-white"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
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
              onClick={handleAddCategory}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Thêm danh mục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog chỉnh sửa danh mục */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Chỉnh sửa danh mục</DialogTitle>
            <DialogDescription className="text-gray-400">
              Cập nhật tên danh mục
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_category_name" className="text-gray-300">Tên danh mục</Label>
              <Input
                id="edit_category_name"
                placeholder="Nhập tên danh mục"
                className="bg-gray-700 border-gray-600 text-white"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
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
              onClick={handleUpdateCategory}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 