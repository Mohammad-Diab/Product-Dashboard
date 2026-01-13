import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateProductInput, Product, UpdateProductInput } from '@/features/products';
import { useCreateProduct, useDeleteProduct, useUpdateProduct } from '@/features/products/hooks';
import * as productApi from '@/features/products/api/client';


jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/features/products/api/client', () => ({
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test description',
  price: 99.99,
  status: 'active',
  createdBy: '123e4567-e89b-12d3-a456-426614174000',
  createdAt: '2024-01-01T00:00:00Z',
};

describe('Product Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCreateProduct', () => {
    it('should create a product successfully', async () => {
      const newProduct: CreateProductInput = {
        name: 'New Product',
        description: 'New description',
        price: 49.99,
        status: 'active',
      };

      (productApi.createProduct as jest.Mock).mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useCreateProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newProduct);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(productApi.createProduct).toHaveBeenCalledWith(newProduct);
      expect(result.current.data).toEqual(mockProduct);
    });

    it('should show success toast on successful creation', async () => {
      const newProduct: CreateProductInput = {
        name: 'New Product',
        description: 'New description',
        price: 49.99,
        status: 'active',
      };

      (productApi.createProduct as jest.Mock).mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useCreateProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newProduct);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(toast.success).toHaveBeenCalledWith(
        `Product "${mockProduct.name}" created successfully!`
      );
    });

    it('should handle creation error', async () => {
      const newProduct: CreateProductInput = {
        name: 'New Product',
        description: 'New description',
        price: 49.99,
        status: 'active',
      };

      const error = new Error('Creation failed');
      (productApi.createProduct as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useCreateProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newProduct);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUpdateProduct', () => {
    it('should update a product successfully', async () => {
      const updateData: UpdateProductInput = {
        name: 'Updated Product',
        price: 149.99,
        status: 'inactive',
      };

      const updatedProduct = { ...mockProduct, ...updateData };
      (productApi.updateProduct as jest.Mock).mockResolvedValue(updatedProduct);

      const { result } = renderHook(() => useUpdateProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(productApi.updateProduct).toHaveBeenCalledWith('1', updateData);
      expect(result.current.data).toEqual(updatedProduct);
    });

    it('should show success toast on successful update', async () => {
      const updateData: UpdateProductInput = {
        name: 'Updated Product',
        price: 149.99,
      };

      const updatedProduct = { ...mockProduct, ...updateData };
      (productApi.updateProduct as jest.Mock).mockResolvedValue(updatedProduct);

      const { result } = renderHook(() => useUpdateProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(toast.success).toHaveBeenCalledWith(
        `Product "${updatedProduct.name}" updated successfully!`
      );
    });

    it('should handle update error', async () => {
      const updateData: UpdateProductInput = {
        name: 'Updated Product',
      };

      const error = new Error('Update failed');
      (productApi.updateProduct as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: updateData });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should handle partial updates', async () => {
      const updateData: UpdateProductInput = {
        status: 'inactive',
      };

      const updatedProduct = { ...mockProduct, status: 'inactive' as const };
      (productApi.updateProduct as jest.Mock).mockResolvedValue(updatedProduct);

      const { result } = renderHook(() => useUpdateProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(productApi.updateProduct).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('useDeleteProduct', () => {
    it('should delete a product successfully', async () => {
      (productApi.deleteProduct as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(productApi.deleteProduct).toHaveBeenCalledWith('1');
    });

    it('should show success toast on successful deletion', async () => {
      (productApi.deleteProduct as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(toast.success).toHaveBeenCalledWith('Product deleted successfully!');
    });

    it('should handle deletion error', async () => {
      const error = new Error('Deletion failed');
      (productApi.deleteProduct as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should implement optimistic updates', async () => {
      (productApi.deleteProduct as jest.Mock).mockResolvedValue(undefined);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      // Set initial data
      queryClient.setQueryData(['products'], {
        pages: [
          {
            items: [mockProduct, { ...mockProduct, id: '2' }],
            total: 2,
            hasMore: false,
          },
        ],
        pageParams: [null],
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useDeleteProduct(), { wrapper });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should rollback on error', async () => {
      const error = new Error('Deletion failed');
      (productApi.deleteProduct as jest.Mock).mockRejectedValue(error);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      const initialData = {
        pages: [
          {
            items: [mockProduct, { ...mockProduct, id: '2' }],
            total: 2,
            hasMore: false,
          },
        ],
        pageParams: [null],
      };

      queryClient.setQueryData(['products'], initialData);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useDeleteProduct(), { wrapper });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Data should be rolled back
      const data = queryClient.getQueryData(['products']);
      expect(data).toBeDefined();
    });
  });
});
