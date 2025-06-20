"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { productSchema, type ProductFormData } from "@/lib/validations/product"
import { type Category } from "@/lib/api"
import { ImageUpload } from "./image-upload"

interface ProductFormProps {
  categories: Category[]
  defaultValues?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  submitLabel: string
}

export function ProductForm({
  categories,
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_name: "",
      category_id: "",
      brand: "",
      price: 0,
      stock_quantity: 0,
      description: "",
      image_url: "",
      ...defaultValues
    }
  })

  const categoryId = watch("category_id")
  const imageUrl = watch("image_url")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="product_name" className="text-gray-300">
            Tên sản phẩm <span className="text-red-500">*</span>
          </Label>
          <Input
            id="product_name"
            placeholder="Nhập tên sản phẩm"
            className="bg-gray-700 border-gray-600 text-white mt-1"
            {...register("product_name")}
          />
          {errors.product_name && (
            <p className="text-red-500 text-sm mt-1">{errors.product_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category_id" className="text-gray-300">
            Danh mục <span className="text-red-500">*</span>
          </Label>
          <Select value={categoryId} onValueChange={(value) => setValue("category_id", value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-white">
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="brand" className="text-gray-300">Thương hiệu</Label>
          <Input
            id="brand"
            placeholder="Nhập thương hiệu"
            className="bg-gray-700 border-gray-600 text-white mt-1"
            {...register("brand")}
          />
          {errors.brand && (
            <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="price" className="text-gray-300">
            Giá bán (VNĐ) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            placeholder="Nhập giá sản phẩm"
            className="bg-gray-700 border-gray-600 text-white mt-1"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="stock_quantity" className="text-gray-300">
            Số lượng tồn kho <span className="text-red-500">*</span>
          </Label>
          <Input
            id="stock_quantity"
            type="number"
            placeholder="Nhập số lượng"
            className="bg-gray-700 border-gray-600 text-white mt-1"
            {...register("stock_quantity", { valueAsNumber: true })}
          />
          {errors.stock_quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.stock_quantity.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <ImageUpload
            value={imageUrl}
            onChange={(url) => setValue("image_url", url)}
            disabled={isLoading}
            label="Hình ảnh sản phẩm"
          />
          {errors.image_url && (
            <p className="text-red-500 text-sm mt-1">{errors.image_url.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <Label htmlFor="description" className="text-gray-300">Mô tả</Label>
          <textarea
            id="description"
            rows={3}
            placeholder="Nhập mô tả sản phẩm"
            className="w-full mt-1 rounded-md bg-gray-700 border-gray-600 text-white p-2"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button 
          type="button"
          variant="outline" 
          onClick={onCancel}
          className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button 
          type="submit"
          className="bg-yellow-600 hover:bg-yellow-700 text-black"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
