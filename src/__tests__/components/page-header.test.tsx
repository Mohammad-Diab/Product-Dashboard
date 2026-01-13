import { render, screen } from '@testing-library/react';
import { PageHeader } from '@/components';

describe('PageHeader', () => {
  describe('rendering', () => {
    it('should render title', () => {
      render(<PageHeader title="Products" />);

      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument();
    });

    it('should render with description', () => {
      render(<PageHeader title="Products" description="Manage your products" />);

      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Manage your products')).toBeInTheDocument();
    });

    it('should render without description', () => {
      render(<PageHeader title="Products" />);

      expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    });

    it('should render with actions', () => {
      render(
        <PageHeader
          title="Products"
          actions={<button>Add Product</button>}
        />
      );

      expect(screen.getByRole('button', { name: 'Add Product' })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <PageHeader title="Products" className="custom-class" />
      );

      const header = container.firstChild;
      expect(header).toHaveClass('custom-class');
    });
  });

  describe('layout', () => {
    it('should use flex layout when actions are provided', () => {
      const { container } = render(
        <PageHeader
          title="Products"
          actions={<button>Action</button>}
        />
      );

      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('justify-between');
    });

    it('should not use flex layout when no actions', () => {
      const { container } = render(<PageHeader title="Products" />);

      const header = container.firstChild as HTMLElement;
      expect(header).not.toHaveClass('flex');
    });

    it('should have correct structure with description and actions', () => {
      render(
        <PageHeader
          title="Products"
          description="Manage all products"
          actions={<button>Add</button>}
        />
      );

      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Manage all products')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });
  });

  describe('title styling', () => {
    it('should have correct heading level', () => {
      render(<PageHeader title="Products" />);

      const heading = screen.getByRole('heading', { name: 'Products' });
      expect(heading.tagName).toBe('H1');
    });

    it('should have correct title classes', () => {
      render(<PageHeader title="Products" />);

      const heading = screen.getByRole('heading', { name: 'Products' });
      expect(heading).toHaveClass('text-3xl');
      expect(heading).toHaveClass('font-bold');
      expect(heading).toHaveClass('text-gray-900');
    });
  });

  describe('description styling', () => {
    it('should have correct description classes', () => {
      render(<PageHeader title="Products" description="Test description" />);

      const description = screen.getByText('Test description');
      expect(description).toHaveClass('text-gray-600');
      expect(description).toHaveClass('mt-2');
    });

    it('should render description as paragraph', () => {
      render(<PageHeader title="Products" description="Test description" />);

      const description = screen.getByText('Test description');
      expect(description.tagName).toBe('P');
    });
  });

  describe('actions', () => {
    it('should render single action button', () => {
      render(
        <PageHeader
          title="Products"
          actions={<button>Add Product</button>}
        />
      );

      expect(screen.getByRole('button', { name: 'Add Product' })).toBeInTheDocument();
    });

    it('should render multiple action buttons', () => {
      render(
        <PageHeader
          title="Products"
          actions={
            <div>
              <button>Add</button>
              <button>Export</button>
            </div>
          }
        />
      );

      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
    });

    it('should render complex action content', () => {
      render(
        <PageHeader
          title="Products"
          actions={
            <div className="flex gap-2">
              <button>Filter</button>
              <button>Sort</button>
            </div>
          }
        />
      );

      expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sort' })).toBeInTheDocument();
    });
  });

  describe('combinations', () => {
    it('should work with title only', () => {
      render(<PageHeader title="Dashboard" />);

      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    });

    it('should work with title and description', () => {
      render(
        <PageHeader
          title="Dashboard"
          description="Welcome to your dashboard"
        />
      );

      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByText('Welcome to your dashboard')).toBeInTheDocument();
    });

    it('should work with title and actions', () => {
      render(
        <PageHeader
          title="Products"
          actions={<button>Add</button>}
        />
      );

      expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('should work with all props', () => {
      render(
        <PageHeader
          title="Products"
          description="Manage your products"
          className="custom-header"
          actions={<button>Add Product</button>}
        />
      );

      expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument();
      expect(screen.getByText('Manage your products')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Product' })).toBeInTheDocument();
    });
  });

  describe('real-world scenarios', () => {
    it('should render products page header', () => {
      render(
        <PageHeader
          title="Products"
          description="Manage your product catalog"
          actions={<button className="btn-primary">Add New Product</button>}
        />
      );

      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Manage your product catalog')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add New Product' })).toBeInTheDocument();
    });

    it('should render orders page header', () => {
      render(
        <PageHeader
          title="Orders"
          description="View and manage customer orders"
          actions={
            <div className="flex gap-2">
              <button>Filter</button>
              <button>Export</button>
            </div>
          }
        />
      );

      expect(screen.getByText('Orders')).toBeInTheDocument();
      expect(screen.getByText('View and manage customer orders')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
    });

    it('should render dashboard header without actions', () => {
      render(
        <PageHeader
          title="Dashboard"
          description="Overview of your business metrics"
        />
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Overview of your business metrics')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<PageHeader title="Page Title" />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should maintain semantic structure with all elements', () => {
      const { container } = render(
        <PageHeader
          title="Products"
          description="Description"
          actions={<button>Action</button>}
        />
      );

      expect(container.querySelector('h1')).toBeInTheDocument();
      expect(container.querySelector('p')).toBeInTheDocument();
    });
  });
});
