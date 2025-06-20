"use client"

import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"
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
  ChevronDown,
  Upload,
  Package,
  Loader2
} from "lucide-react"
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"
import { type Product, type CreateProductData, type UpdateProductData } from "@/lib/api"
import { ProductForm } from "@/components/admin/product-form"
import { ProductTableSkeleton } from "@/components/admin/product-table-skeleton"
import { type ProductFormData } from "@/lib/validations/product"
import { toast } from "sonner"

export default function ProductsPage() {
  // State cho filters và pagination
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // State cho dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // State cho edit form
  const [editFormData, setEditFormData] = useState<ProductFormData | undefined>()

  // Debounce search term để tránh gọi API quá nhiều
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)

  // API hooks
  const { data: productsData, isLoading: productsLoading, error: productsError } = useProducts({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  })

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const deleteProductMutation = useDeleteProduct()

  // Lấy danh sách products và categories
  const allProducts = productsData?.products || []
  const pagination = productsData?.pagination
  const categories = categoriesData?.categories || []

  // Filter products theo status (client-side filtering)
  const products = allProducts.filter((product) => {
    if (statusFilter === "all") return true
    const productStatus = getProductStatus(product)
    return productStatus === statusFilter
  })

  // Reset trang khi debounced search term thay đổi
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setCurrentPage(1)
    }
  }, [debouncedSearchTerm, searchTerm])
  // Định dạng giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  // Xác định trạng thái sản phẩm dựa trên stock và is_active
  const getProductStatus = (product: Product) => {
    if (!product.is_active) return "Ngừng kinh doanh"
    if (product.stock_quantity === 0) return "Hết hàng"
    if (product.stock_quantity <= 5) return "Sắp hết hàng"
    return "Đang bán"
  }

  // Xác định màu sắc cho badge trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang bán":
        return "bg-green-500 hover:bg-green-600"
      case "Hết hàng":
        return "bg-red-500 hover:bg-red-600"
      case "Sắp hết hàng":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Ngừng kinh doanh":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  // Xử lý mở dialog chỉnh sửa sản phẩm
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setEditFormData({
      product_name: product.product_name,
      category_id: product.category_id._id,
      brand: product.brand || "",
      price: product.price,
      stock_quantity: product.stock_quantity,
      description: product.description || "",
      image_url: product.image_url || "",
    })
    setIsEditDialogOpen(true)
  }

  // Xử lý mở dialog xóa sản phẩm
  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  // Xử lý tạo sản phẩm mới
  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      await createProductMutation.mutateAsync(data)
      setIsAddDialogOpen(false)
    } catch (error) {
      // Error được xử lý trong hook
    }
  }

  // Xử lý cập nhật sản phẩm
  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!selectedProduct) return

    try {
      await updateProductMutation.mutateAsync({
        productId: selectedProduct._id,
        productData: data,
      })
      setIsEditDialogOpen(false)
      setSelectedProduct(null)
      setEditFormData(undefined)
    } catch (error) {
      // Error được xử lý trong hook
    }
  }

  // Xử lý xóa sản phẩm
  const handleConfirmDelete = async () => {
    if (!selectedProduct) return

    try {
      await deleteProductMutation.mutateAsync(selectedProduct._id)
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      // Error được xử lý trong hook
    }
  }

  // Reset form khi đóng dialog
  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedProduct(null)
    setEditFormData(undefined)
  }

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Xử lý thay đổi search term
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset về trang 1 khi search
  }

  // Xử lý thay đổi category filter
  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value)
    setCurrentPage(1) // Reset về trang 1 khi filter
  }

  // Xử lý thay đổi status filter
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1) // Reset về trang 1 khi filter
  }

  // Hiển thị loading khi đang tải dữ liệu
  if (productsLoading || categoriesLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          <span className="ml-2 text-gray-400">Đang tải dữ liệu...</span>
        </div>
      </div>
    )
  }

  // Hiển thị lỗi nếu có
  if (productsError) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Package className="h-6 w-6 mr-2 text-yellow-500" />
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-black"
          disabled={createProductMutation.isPending}
        >
          {createProductMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Thêm sản phẩm
        </Button>
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
                placeholder="Tìm theo tên hoặc mã sản phẩm..."
                className="bg-gray-700 border-gray-600 text-white pl-10"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Đang bán">Đang bán</SelectItem>
                <SelectItem value="Hết hàng">Hết hàng</SelectItem>
                <SelectItem value="Sắp hết hàng">Sắp hết hàng</SelectItem>
                <SelectItem value="Ngừng kinh doanh">Ngừng kinh doanh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          {productsLoading ? (
            <ProductTableSkeleton />
          ) : (
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow className="border-gray-700 hover:bg-gray-900">
                  <TableHead className="text-gray-400">Mã SP</TableHead>
                  <TableHead className="text-gray-400">Tên sản phẩm</TableHead>
                  <TableHead className="text-gray-400">Danh mục</TableHead>
                  <TableHead className="text-gray-400">Giá</TableHead>
                  <TableHead className="text-gray-400">Tồn kho</TableHead>
                  <TableHead className="text-gray-400">Trạng thái</TableHead>
                  <TableHead className="text-gray-400 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const status = getProductStatus(product)
                  return (
                    <TableRow key={product._id} className="border-gray-700 hover:bg-gray-700">
                      <TableCell className="font-medium text-white">{product._id.slice(-6).toUpperCase()}</TableCell>
                      <TableCell className="text-white">{product.product_name}</TableCell>
                      <TableCell className="text-gray-300">{product.category_id.category_name}</TableCell>
                      <TableCell className="text-yellow-500 font-medium">{formatPrice(product.price)}</TableCell>
                      <TableCell className="text-gray-300">{product.stock_quantity}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(status)}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-600"
                            onClick={() => handleEditProduct(product)}
                            disabled={updateProductMutation.isPending}
                          >
                            {updateProductMutation.isPending && selectedProduct?._id === product._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Edit className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-gray-600 text-red-400 hover:text-white hover:bg-red-900 hover:border-red-700"
                            onClick={() => handleDeleteProduct(product)}
                            disabled={deleteProductMutation.isPending}
                          >
                            {deleteProductMutation.isPending && selectedProduct?._id === product._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}

                {!productsLoading && products.length === 0 && (
                  <TableRow className="border-gray-700">
                    <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                      {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                        ? "Không tìm thấy sản phẩm nào phù hợp với bộ lọc"
                        : "Chưa có sản phẩm nào"
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {pagination && (
        <div className="mt-4 flex justify-between items-center text-gray-400">
          <div>
            Hiển thị {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, pagination.total)} trong tổng số {pagination.total} sản phẩm
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + 1
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {pagination.pages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < pagination.pages && handlePageChange(currentPage + 1)}
                  className={currentPage >= pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      {/* Dialog thêm sản phẩm mới */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Thêm sản phẩm mới</DialogTitle>
            <DialogDescription className="text-gray-400">
              Điền thông tin chi tiết sản phẩm bên dưới
            </DialogDescription>
          </DialogHeader>

          <ProductForm
            categories={categories}
            onSubmit={handleCreateProduct}
            onCancel={handleCloseAddDialog}
            isLoading={createProductMutation.isPending}
            submitLabel="Thêm sản phẩm"
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog chỉnh sửa sản phẩm */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              Chỉnh sửa sản phẩm {selectedProduct?._id.slice(-6).toUpperCase()}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Cập nhật thông tin sản phẩm
            </DialogDescription>
          </DialogHeader>

          {editFormData && (
            <ProductForm
              categories={categories}
              defaultValues={editFormData}
              onSubmit={handleUpdateProduct}
              onCancel={handleCloseEditDialog}
              isLoading={updateProductMutation.isPending}
              submitLabel="Lưu thay đổi"
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog xóa sản phẩm */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Xác nhận xóa sản phẩm</DialogTitle>
            <DialogDescription className="text-gray-400">
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="py-4">
              <div className="flex items-center p-4 border border-gray-700 rounded-lg bg-gray-700/50">
                <Package className="h-10 w-10 text-yellow-500 mr-4" />
                <div>
                  <p className="font-medium text-white">{selectedProduct.product_name}</p>
                  <p className="text-sm text-gray-400">Mã sản phẩm: {selectedProduct._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
              disabled={deleteProductMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Xóa sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 