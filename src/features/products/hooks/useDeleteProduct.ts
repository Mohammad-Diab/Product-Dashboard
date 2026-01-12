'use client';

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteProduct } from '../api/client';
import { ProductsResponse } from '../types';

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteProduct(id),
        onMutate: async (deletedId: string) => {
            await queryClient.cancelQueries({ queryKey: ['products'] });

            const previousData = queryClient.getQueryData<InfiniteData<ProductsResponse, string | null>>(['products']);

            queryClient.setQueryData<InfiniteData<ProductsResponse, string | null>>(['products'], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        items: page.items.filter((product) => product.id !== deletedId),
                    })),
                };
            });

            return { previousData };
        },
        onError: (_error, _deletedId, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['products'], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onSuccess: () => {
            toast.success('Product deleted successfully!');
        },
    });
}
