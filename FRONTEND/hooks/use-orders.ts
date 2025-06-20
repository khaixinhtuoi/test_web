import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderAPI, type Order, type CreateOrderData } from '@/lib/api';
import { toast } from 'sonner';

// Hook để lấy danh sách đơn hàng của người dùng
export const useUserOrders = () => {
  return useQuery({
    queryKey: ['user-orders'],
    queryFn: orderAPI.getUserOrders,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// Hook để lấy chi tiết đơn hàng
export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderAPI.getOrderDetails(orderId),
    enabled: !!orderId,
  });
};

// Hook để tạo đơn hàng mới
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => {
      console.log('Creating order with data:', data);
      return orderAPI.createOrder(data);
    },
    onSuccess: (data) => {
      console.log('Order created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      toast.success(data.message || 'Đặt hàng thành công!');
    },
    onError: (error: any) => {
      console.error('Order creation failed:', error);
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng';
      toast.error(message);
    },
  });
};

// Hook để hủy đơn hàng
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderAPI.cancelOrder(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      toast.success(data.message || 'Đã hủy đơn hàng!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng';
      toast.error(message);
    },
  });
};
