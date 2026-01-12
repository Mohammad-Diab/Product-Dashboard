'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus } from '../api/client';
import { UpdateOrderInput, Order } from '../types';

type UpdateOrderStatusParams = {
  id: string;
  data: UpdateOrderInput;
};

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateOrderStatusParams) => updateOrderStatus(id, data),
    onSuccess: (updatedOrder: Order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', updatedOrder.id] });
    },
  });
}
