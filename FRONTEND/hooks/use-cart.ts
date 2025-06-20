import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartAPI, type CartItem, type AddToCartData, type UpdateCartItemData } from '@/lib/api';
import { toast } from 'sonner';

// Hook để lấy giỏ hàng
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartAPI.getCart,
    staleTime: 1 * 60 * 1000, // 1 phút
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'), // Chỉ gọi khi đã đăng nhập
    retry: (failureCount, error: any) => {
      // Không retry nếu lỗi 401 (unauthorized)
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook để thêm sản phẩm vào giỏ hàng
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartData) => {
      // Kiểm tra đăng nhập trước khi gọi API
      if (typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
        throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      }
      return cartAPI.addToCart(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(data.message || 'Đã thêm sản phẩm vào giỏ hàng!');
    },
    onError: (error: any) => {
      let message = 'Có lỗi xảy ra khi thêm vào giỏ hàng';

      if (error.message === 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng') {
        message = error.message;
      } else if (error.response?.status === 401) {
        message = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      toast.error(message);

      // Nếu lỗi 401, có thể chuyển hướng đến trang đăng nhập
      if (error.response?.status === 401) {
        setTimeout(() => {
          window.location.href = '/auth';
        }, 2000);
      }
    },
  });
};

// Hook để cập nhật số lượng sản phẩm trong giỏ hàng
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartItemId, data }: { cartItemId: string; data: UpdateCartItemData }) =>
      cartAPI.updateCartItem(cartItemId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(data.message || 'Đã cập nhật giỏ hàng!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật giỏ hàng';
      toast.error(message);
    },
  });
};

// Hook để xóa sản phẩm khỏi giỏ hàng
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: string) => cartAPI.removeFromCart(cartItemId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(data.message || 'Đã xóa sản phẩm khỏi giỏ hàng!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm';
      toast.error(message);
    },
  });
};

// Hook để xóa toàn bộ giỏ hàng
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartAPI.clearCart(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(data.message || 'Đã xóa toàn bộ giỏ hàng!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa giỏ hàng';
      toast.error(message);
    },
  });
};

// Hook để lấy số lượng sản phẩm trong giỏ hàng
export const useCartCount = () => {
  const { data: cartData, isError } = useCart();

  // Nếu có lỗi hoặc chưa đăng nhập, trả về 0
  if (isError || typeof window === 'undefined' || !localStorage.getItem('accessToken')) {
    return 0;
  }

  return cartData?.totalItems || 0;
};
