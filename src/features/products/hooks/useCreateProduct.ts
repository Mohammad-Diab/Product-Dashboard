'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../api/client';
import { CreateProductInput, Product } from '../types';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) => createProduct(data),
    onSuccess: (newProduct: Product) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
