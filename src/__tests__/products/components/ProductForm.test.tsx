import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductForm } from '@/features/products/components';
import { Product } from '@/features/products/types';

describe('ProductForm', () => {
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    isSubmitting: false,
  };

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test description',
    price: 99.99,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    createdBy: '123e4567-e89b-12d3-a456-426614174000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render all form fields', () => {
      render(<ProductForm {...defaultProps} />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    });

    it('should render submit button for create mode', () => {
      render(<ProductForm {...defaultProps} />);

      expect(screen.getByRole('button', { name: /create product/i })).toBeInTheDocument();
    });

    it('should render submit button for edit mode', () => {
      render(<ProductForm {...defaultProps} initialData={mockProduct} />);

      expect(screen.getByRole('button', { name: /update product/i })).toBeInTheDocument();
    });

    it('should mark required fields with asterisk', () => {
      const { container } = render(<ProductForm {...defaultProps} />);

      const nameLabel = screen.getByText(/name/i).closest('label');
      const priceLabel = screen.getByText(/price/i).closest('label');
      const statusLabel = screen.getByText(/status/i).closest('label');

      expect(nameLabel).toHaveTextContent('*');
      expect(priceLabel).toHaveTextContent('*');
      expect(statusLabel).toHaveTextContent('*');
    });

    it('should not mark description as required', () => {
      render(<ProductForm {...defaultProps} />);

      const descriptionLabel = screen.getByText(/description/i).closest('label');
      expect(descriptionLabel?.textContent).not.toContain('*');
    });

    it('should have correct input types', () => {
      render(<ProductForm {...defaultProps} />);

      expect(screen.getByLabelText(/name/i)).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText(/price/i)).toHaveAttribute('type', 'number');
    });
  });

  describe('initial data', () => {
    it('should populate form with initial data in edit mode', () => {
      render(<ProductForm {...defaultProps} initialData={mockProduct} />);

      expect(screen.getByLabelText(/name/i)).toHaveValue('Test Product');
      expect(screen.getByLabelText(/description/i)).toHaveValue('Test description');
      expect(screen.getByLabelText(/price/i)).toHaveValue(99.99);
      expect(screen.getByLabelText(/status/i)).toHaveValue('active');
    });

    it('should start with empty form in create mode', () => {
      render(<ProductForm {...defaultProps} />);

      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
      expect(screen.getByLabelText(/price/i)).toHaveValue(0);
      expect(screen.getByLabelText(/status/i)).toHaveValue('active');
    });

    it('should handle product without description', () => {
      const productNoDesc = { ...mockProduct, description: '' };
      render(<ProductForm {...defaultProps} initialData={productNoDesc} />);

      expect(screen.getByLabelText(/description/i)).toHaveValue('');
    });
  });

  describe('form validation', () => {
    it('should show error when name is empty', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /create product/i }));

      await waitFor(() => {
        expect(screen.getByText(/name must be at least 3 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error for name less than 3 characters', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/name/i), 'AB');
      await user.click(screen.getByRole('button', { name: /create product/i }));

      await waitFor(() => {
        expect(screen.getByText(/name must be at least 3 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error for description over 500 characters', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ProductForm {...defaultProps} />);

      const longDescription = 'A'.repeat(502);
      await user.type(screen.getByLabelText(/name/i), 'Valid Name');
      await user.type(screen.getByLabelText(/description/i), longDescription);
      await user.click(screen.getByRole('button', { name: /create product/i }));

      await waitFor(() => {
        expect(screen.getByText(/description must not exceed 500 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error for negative price', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      const priceInput = screen.getByLabelText(/price/i);
      await user.clear(priceInput);
      await user.type(priceInput, '-10');
      await user.click(screen.getByRole('button', { name: /create product/i }));

      await waitFor(() => {
        expect(screen.getByText(/price must be a positive number/i)).toBeInTheDocument();
      });
    });

    it('should show error for zero price', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/name/i), 'Valid Product');
      await user.click(screen.getByRole('button', { name: /create product/i }));

      await waitFor(() => {
        expect(screen.getByText(/price must be a positive number/i)).toBeInTheDocument();
      });
    });

    it('should accept valid form data', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/name/i), 'Valid Product');
      await user.type(screen.getByLabelText(/description/i), 'Valid description');

      const priceInput = screen.getByLabelText(/price/i);
      await user.clear(priceInput);
      await user.type(priceInput, '99.99');

      await user.click(screen.getByRole('button', { name: /create product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('form submission', () => {
    it('should call onSubmit with correct data', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/name/i), 'New Product');
      await user.type(screen.getByLabelText(/description/i), 'Product description');

      const priceInput = screen.getByLabelText(/price/i);
      await user.clear(priceInput);
      await user.type(priceInput, '49.99');

      await user.selectOptions(screen.getByLabelText(/status/i), 'inactive');

      await user.click(screen.getByRole('button', { name: /create product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
        const callArgs = mockOnSubmit.mock.calls[0];
        expect(callArgs[0]).toEqual({
          name: 'New Product',
          description: 'Product description',
          price: 49.99,
          status: 'inactive',
        });
      });
    });

    it('should call onSubmit with updated data in edit mode', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} initialData={mockProduct} />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Product');

      await user.click(screen.getByRole('button', { name: /update product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
        const callArgs = mockOnSubmit.mock.calls[0];
        expect(callArgs[0]).toEqual({
          name: 'Updated Product',
          description: 'Test description',
          price: 99.99,
          status: 'active',
        });
      });
    });

    it('should handle empty description', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/name/i), 'Product Name');

      const priceInput = screen.getByLabelText(/price/i);
      await user.clear(priceInput);
      await user.type(priceInput, '29.99');

      await user.click(screen.getByRole('button', { name: /create product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
        const callArgs = mockOnSubmit.mock.calls[0];
        expect(callArgs[0]).toEqual({
          name: 'Product Name',
          description: '',
          price: 29.99,
          status: 'active',
        });
      });
    });

    it('should disable submit button during submission', async () => {
      render(<ProductForm {...defaultProps} isSubmitting={true} />);

      const submitButton = screen.getByRole('button', { name: /loading/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show loading state on submit button', async () => {
      render(<ProductForm {...defaultProps} isSubmitting={true} />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('server errors', () => {
    it('should display server error message', () => {
      render(<ProductForm {...defaultProps} serverError="Server error occurred" />);

      expect(screen.getByText('Server error occurred')).toBeInTheDocument();
    });

    it('should not display error when serverError is undefined', () => {
      render(<ProductForm {...defaultProps} />);

      // ErrorMessage component should not render anything
      const errorText = screen.queryByRole('alert');
      expect(errorText).not.toBeInTheDocument();
    });

    it('should display error along with form', () => {
      render(<ProductForm {...defaultProps} serverError="Failed to save product" />);

      expect(screen.getByText('Failed to save product')).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('should allow typing in all text fields', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      const descInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;

      await user.type(nameInput, 'My Product');
      await user.type(descInput, 'My description');

      expect(nameInput.value).toBe('My Product');
      expect(descInput.value).toBe('My description');
    });

    it('should allow changing price', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      const priceInput = screen.getByLabelText(/price/i) as HTMLInputElement;
      await user.clear(priceInput);
      await user.type(priceInput, '123.45');

      expect(priceInput.value).toBe('123.45');
    });

    it('should allow changing status', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      const statusSelect = screen.getByLabelText(/status/i) as HTMLSelectElement;
      await user.selectOptions(statusSelect, 'inactive');

      expect(statusSelect.value).toBe('inactive');
    });

    it('should allow clearing and retyping', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;

      await user.type(nameInput, 'First Name');
      expect(nameInput.value).toBe('First Name');

      await user.clear(nameInput);
      expect(nameInput.value).toBe('');

      await user.type(nameInput, 'Second Name');
      expect(nameInput.value).toBe('Second Name');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete create flow', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      // Fill all fields
      await user.type(screen.getByLabelText(/name/i), 'Gaming Laptop');
      await user.type(screen.getByLabelText(/description/i), 'High-performance gaming laptop');

      const priceInput = screen.getByLabelText(/price/i);
      await user.clear(priceInput);
      await user.type(priceInput, '1299.99');

      await user.selectOptions(screen.getByLabelText(/status/i), 'active');

      // Submit
      await user.click(screen.getByRole('button', { name: /create product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
        const callArgs = mockOnSubmit.mock.calls[0];
        expect(callArgs[0]).toEqual({
          name: 'Gaming Laptop',
          description: 'High-performance gaming laptop',
          price: 1299.99,
          status: 'active',
        });
      });
    });

    it('should handle complete edit flow', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} initialData={mockProduct} />);

      // Update fields
      const nameInput = screen.getByLabelText(/name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Product Name');

      const priceInput = screen.getByLabelText(/price/i);
      await user.clear(priceInput);
      await user.type(priceInput, '149.99');

      // Submit
      await user.click(screen.getByRole('button', { name: /update product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
        const callArgs = mockOnSubmit.mock.calls[0];
        expect(callArgs[0]).toEqual({
          name: 'Updated Product Name',
          description: 'Test description',
          price: 149.99,
          status: 'active',
        });
      });
    });

    it('should handle validation errors gracefully', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      // Submit empty form
      await user.click(screen.getByRole('button', { name: /create product/i }));

      await waitFor(() => {
        expect(screen.getByText(/name must be at least 3 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/Price must be a positive number/i)).toBeInTheDocument();
      });

      // onSubmit should not be called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should handle decimal prices correctly', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/name/i), 'Test Product');

      const priceInput = screen.getByLabelText(/price/i);
      await user.clear(priceInput);
      await user.type(priceInput, '9.99');

      await user.click(screen.getByRole('button', { name: /create product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
        const callArgs = mockOnSubmit.mock.calls[0];
        expect(callArgs[0]).toEqual(
          expect.objectContaining({
            price: 9.99,
          })
        );
      });
    });
  });

  describe('edge cases', () => {
    it('should show validation error for names exceeding 50 characters', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      const longName = 'A'.repeat(100);
      await user.type(screen.getByLabelText(/name/i), longName);

      const priceInput = screen.getByLabelText(/price/i);
      await user.clear(priceInput);
      await user.type(priceInput, '10');

      await user.click(screen.getByRole('button', { name: /create product/i }));

      // Should show validation error, not submit
      await waitFor(() => {
        expect(screen.getByText(/name must not exceed 50 characters/i)).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should handle large price values', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/name/i), 'Expensive Item');

      const priceInput = screen.getByLabelText(/price/i);
      await user.clear(priceInput);
      await user.type(priceInput, '999999.99');

      await user.click(screen.getByRole('button', { name: /create product/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });

      const callArgs = mockOnSubmit.mock.calls[0][0];
      expect(callArgs.price).toBe(999999.99);
    });

    it('should handle status toggle multiple times', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);

      const statusSelect = screen.getByLabelText(/status/i) as HTMLSelectElement;

      await user.selectOptions(statusSelect, 'inactive');
      expect(statusSelect.value).toBe('inactive');

      await user.selectOptions(statusSelect, 'active');
      expect(statusSelect.value).toBe('active');

      await user.selectOptions(statusSelect, 'inactive');
      expect(statusSelect.value).toBe('inactive');
    });
  });
});
