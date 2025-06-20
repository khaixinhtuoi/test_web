import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI, type Product, type ProductFilters, type CreateProductData, type UpdateProductData } from '@/lib/api';
import { toast } from 'sonner';

// Hook để lấy danh sách products
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => adminAPI.getAllProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// Hook để lấy product theo ID
export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => adminAPI.getProductById(productId),
    enabled: !!productId,
  });
};

// Hook để tạo product mới
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: CreateProductData) => adminAPI.createProduct(productData),
    onSuccess: (data) => {
      // Invalidate và refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(data.message || 'Tạo sản phẩm thành công!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm';
      toast.error(message);
    },
  });
};

// Hook để cập nhật product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, productData }: { productId: string; productData: UpdateProductData }) =>
      adminAPI.updateProduct(productId, productData),
    onSuccess: (data, variables) => {
      // Invalidate và refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Invalidate product detail
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      toast.success(data.message || 'Cập nhật sản phẩm thành công!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm';
      toast.error(message);
    },
  });
};

// Hook để cập nhật trạng thái product
export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, isActive }: { productId: string; isActive: boolean }) =>
      adminAPI.updateProductStatus(productId, isActive),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      toast.success(data.message || 'Cập nhật trạng thái sản phẩm thành công!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái';
      toast.error(message);
    },
  });
};

// Hook để cập nhật stock
export const useUpdateProductStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, stockQuantity }: { productId: string; stockQuantity: number }) =>
      adminAPI.updateProductStock(productId, stockQuantity),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      toast.success(data.message || 'Cập nhật tồn kho thành công!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tồn kho';
      toast.error(message);
    },
  });
};

// Hook để xóa product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => adminAPI.deleteProduct(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(data.message || 'Xóa sản phẩm thành công!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm';
      toast.error(message);
    },
  });
};
