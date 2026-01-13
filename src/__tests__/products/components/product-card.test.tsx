import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductCard } from '@/features/products/components';
import { Product } from '@/features/products/types';

const mockProduct: Product = {
  id: 'ed5de612-38cd-494e-b422-d3d4d12094f5',
  name: 'Test Product',
  description: 'This is a test product description',
  price: 99.99,
  status: 'active',
  createdBy: '12383f1e-2eb7-490f-b2c3-cec77f94b1b2',
  createdAt: '2026-01-13T04:56:45.177Z',
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ProductCard', () => {
  it('should render product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('This is a test product description')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should render inactive status correctly', () => {
    const inactiveProduct = { ...mockProduct, status: 'inactive' as const };
    renderWithProviders(<ProductCard product={inactiveProduct} />);

    expect(screen.getByText('inactive')).toBeInTheDocument();
  });

  it('should show "No description" when description is empty', () => {
    const productWithoutDescription = { ...mockProduct, description: '' };
    renderWithProviders(<ProductCard product={productWithoutDescription} />);

    expect(screen.getByText('No description')).toBeInTheDocument();
  });

  it('should render edit link with correct href', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const editLink = screen.getByRole('link', { name: /edit/i });
    expect(editLink).toHaveAttribute('href', `/products/${mockProduct.id}/edit`);
  });

  it('should display formatted price', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });
});
