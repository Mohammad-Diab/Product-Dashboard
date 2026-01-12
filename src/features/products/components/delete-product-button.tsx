'use client';

import { useState } from 'react';
import { Button, ConfirmModal } from '@/components';
import { useDeleteProduct } from '../hooks';

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct(productId, {
      onSuccess: () => setShowConfirm(false),
    });
  };

  return (
    <>
      <Button
        variant="danger"
        className="min-w-30"
        size="sm"
        onClick={() => setShowConfirm(true)}
        type="button"
      >
        Delete
      </Button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={
          <>
            <p>
              Are you sure you want to delete <span className="font-semibold">&quot;{productName}&quot;</span>?
            </p>
            <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
          </>
        }
        confirmText="Delete"
        isLoading={isPending}
        variant="danger"
      />
    </>
  );
}
