import { z } from "zod"

export const productSchema = z.object({
  product_name: z
    .string()
    .min(1, "Tên sản phẩm là bắt buộc")
    .min(3, "Tên sản phẩm phải có ít nhất 3 ký tự")
    .max(255, "Tên sản phẩm không được vượt quá 255 ký tự"),
  
  category_id: z
    .string()
    .min(1, "Danh mục là bắt buộc"),
  
  brand: z
    .string()
    .max(100, "Thương hiệu không được vượt quá 100 ký tự")
    .optional()
    .or(z.literal("")),
  
  price: z
    .number()
    .min(0, "Giá phải lớn hơn hoặc bằng 0")
    .max(999999999, "Giá không được vượt quá 999,999,999"),
  
  stock_quantity: z
    .number()
    .int("Số lượng phải là số nguyên")
    .min(0, "Số lượng phải lớn hơn hoặc bằng 0")
    .max(999999, "Số lượng không được vượt quá 999,999"),
  
  description: z
    .string()
    .max(1000, "Mô tả không được vượt quá 1000 ký tự")
    .optional()
    .or(z.literal("")),
  
  image_url: z
    .string()
    .url("URL hình ảnh không hợp lệ")
    .optional()
    .or(z.literal("")),
})

export type ProductFormData = z.infer<typeof productSchema>
