'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/features/products/components/ProductForm';
import { useCreateProduct } from '@/features/products/hooks/useCreateProduct';
import { ProductFormData } from '@/features/products/schemas';
import { getErrorMessage } from '@/lib/get-error-message';

export function NewProduct() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>('');
  const createProduct = useCreateProduct();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setServerError('');
      await createProduct.mutateAsync({
        name: data.name,
        description: data.description || '',
        price: data.price,
        status: data.status,
      });
      router.push('/products');
    } catch (error: unknown) {
      setServerError(getErrorMessage(error, 'Failed to create product. Please try again.'));
    }
  };

  return (
    <ProductForm
      onSubmit={handleSubmit}
      isSubmitting={createProduct.isPending}
      serverError={serverError}
    />
  );
}
