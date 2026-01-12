'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../api/client';
import { UpdateProductInput, Product } from '../types';

type UpdateProductParams = {
  id: string;
  data: UpdateProductInput;
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductParams) => updateProduct(id, data),
    onSuccess: (updatedProduct: Product) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', updatedProduct.id] });
    },
  });
}
