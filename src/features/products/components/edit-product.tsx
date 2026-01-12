'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/features/products/components/ProductForm';
import { useUpdateProduct } from '@/features/products/hooks/useUpdateProduct';
import { ProductFormData } from '@/features/products/schemas';
import { Product } from '@/features/products/types';
import { getErrorMessage } from '@/lib/get-error-message';

type EditProductProps = {
  product: Product;
};

export function EditProduct({ product }: EditProductProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>('');
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setServerError('');
      await updateProduct.mutateAsync({
        id: product.id,
        data: {
          name: data.name,
          description: data.description || '',
          price: data.price,
          status: data.status,
        },
      });
      router.push('/products');
    } catch (error: unknown) {
      setServerError(getErrorMessage(error, 'Failed to update product. Please try again.'));
    }
  };

  return (
    <ProductForm
      initialData={product}
      onSubmit={handleSubmit}
      isSubmitting={updateProduct.isPending}
      serverError={serverError}
    />
  );
}
