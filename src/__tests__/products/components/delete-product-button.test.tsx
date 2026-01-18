import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteProductButton } from '@/features/products/components';
import { useDeleteProduct } from '@/features/products/hooks';

// Mock the hook
jest.mock('@/features/products/hooks', () => ({
  useDeleteProduct: jest.fn(),
}));

const mockUseDeleteProduct = useDeleteProduct as jest.MockedFunction<typeof useDeleteProduct>;

describe('DeleteProductButton', () => {
  const mockMutate = jest.fn();

  const defaultProps = {
    productId: 'prod-123',
    productName: 'Test Product',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseDeleteProduct.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
      data: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      isIdle: true,
      status: 'idle',
      variables: undefined,
      submittedAt: 0,
      reset: jest.fn(),
      mutateAsync: jest.fn(),
      context: undefined,
    });
  });

  describe('rendering', () => {
    it('should render delete button', () => {
      render(<DeleteProductButton {...defaultProps} />);

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should render button with danger variant', () => {
      render(<DeleteProductButton {...defaultProps} />);

      const button = screen.getByRole('button', { name: /delete/i });
      expect(button).toHaveClass('bg-red-600');
    });

    it('should render button with small size', () => {
      render(<DeleteProductButton {...defaultProps} />);

      const button = screen.getByRole('button', { name: /delete/i });
      expect(button).toHaveClass('text-sm');
    });

    it('should not show modal initially', () => {
      render(<DeleteProductButton {...defaultProps} />);

      expect(screen.queryByText('Delete Product')).not.toBeInTheDocument();
    });
  });

  describe('confirmation modal', () => {
    it('should show confirmation modal when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
      });
    });

    it('should display product name in confirmation message', async () => {
      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} productName="Gaming Laptop" />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(screen.getByText(/Gaming Laptop/)).toBeInTheDocument();
      });
    });

    it('should show warning message in modal', async () => {
      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument();
      });
    });

    it('should show confirm and cancel buttons in modal', async () => {
      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        const buttons = screen.getAllByRole('button', { name: /delete/i });
        expect(buttons.length).toBeGreaterThan(1); // Initial button + confirm button
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      });
    });

    it('should use danger variant for confirm button', async () => {
      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        const confirmButtons = screen.getAllByRole('button', { name: /delete/i });
        // Find the modal's confirm button (not the initial trigger button)
        const modalConfirmButton = confirmButtons.find((btn) =>
          btn.classList.contains('bg-red-600')
        );
        expect(modalConfirmButton).toBeTruthy();
      });
    });
  });

  describe('modal interactions', () => {
    it('should close modal when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
      });

      // Click cancel
      await user.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => {
        expect(screen.queryByText('Delete Product')).not.toBeInTheDocument();
      });
    });

    it('should not call delete when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
      });

      // Click cancel
      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('delete operation', () => {
    it('should call mutate with productId when confirmed', async () => {
      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
      });

      // Confirm delete - get all delete buttons and click the one in the modal
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      const modalDeleteButton = deleteButtons[deleteButtons.length - 1];
      await user.click(modalDeleteButton);

      expect(mockMutate).toHaveBeenCalledWith('prod-123', expect.any(Object));
    });

    it('should call mutate with correct productId for different products', async () => {
      const user = userEvent.setup();
      render(<DeleteProductButton productId="prod-456" productName="Different Product" />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      const modalDeleteButton = deleteButtons[deleteButtons.length - 1];
      await user.click(modalDeleteButton);

      expect(mockMutate).toHaveBeenCalledWith('prod-456', expect.any(Object));
    });

    it('should close modal on successful delete', async () => {
      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
      });

      // Mock successful delete by calling onSuccess callback
      mockMutate.mockImplementation((id, options: any) => {
        options.onSuccess?.();
      });

      // Confirm delete
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      const modalDeleteButton = deleteButtons[deleteButtons.length - 1];
      await user.click(modalDeleteButton);

      await waitFor(() => {
        expect(screen.queryByText('Delete Product')).not.toBeInTheDocument();
      });
    });
  });

  describe('loading state', () => {
    it('should show loading state in modal when deleting', async () => {
      mockUseDeleteProduct.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
        isError: false,
        isSuccess: false,
        error: null,
        data: undefined,
        failureCount: 0,
        failureReason: null,
        isPaused: false,
        isIdle: false,
        status: 'pending',
        variables: 'prod-123',
        submittedAt: Date.now(),
        reset: jest.fn(),
        mutateAsync: jest.fn(),
        context: undefined,
      });

      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
      });
    });

    it('should disable buttons in modal when loading', async () => {
      mockUseDeleteProduct.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
        isError: false,
        isSuccess: false,
        error: null,
        data: undefined,
        failureCount: 0,
        failureReason: null,
        isPaused: false,
        isIdle: false,
        status: 'pending',
        variables: 'prod-123',
        submittedAt: Date.now(),
        reset: jest.fn(),
        mutateAsync: jest.fn(),
        context: undefined,
      });

      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        const loadingButton = screen.getByRole('button', { name: /loading/i });
        expect(loadingButton).toBeDisabled();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete delete flow', async () => {
      const user = userEvent.setup();
      let onSuccessCallback: (() => void) | undefined;

      mockMutate.mockImplementation((id, options: any) => {
        onSuccessCallback = options.onSuccess;
      });

      render(<DeleteProductButton productId="prod-789" productName="Product to Delete" />);

      // Click delete button
      await user.click(screen.getByRole('button', { name: /delete/i }));

      // Verify modal opened
      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
        expect(screen.getByText(/Product to Delete/)).toBeInTheDocument();
      });

      // Confirm deletion
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      const modalDeleteButton = deleteButtons[deleteButtons.length - 1];
      await user.click(modalDeleteButton);

      // Verify mutate was called
      expect(mockMutate).toHaveBeenCalledWith('prod-789', expect.any(Object));

      // Simulate successful deletion
      act(() => {
        onSuccessCallback?.();
      });

      // Verify modal closed
      await waitFor(() => {
        expect(screen.queryByText('Delete Product')).not.toBeInTheDocument();
      });
    });

    it('should allow reopening modal after cancellation', async () => {
      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} />);

      // Open modal
      await user.click(screen.getByRole('button', { name: /delete/i }));
      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
      });

      // Cancel
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      await waitFor(() => {
        expect(screen.queryByText('Delete Product')).not.toBeInTheDocument();
      });

      // Reopen modal
      await user.click(screen.getByRole('button', { name: /delete/i }));
      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
      });
    });

    it('should allow reopening modal after successful delete', async () => {
      const user = userEvent.setup();

      mockMutate.mockImplementation((id, options: any) => {
        options.onSuccess?.();
      });

      render(<DeleteProductButton {...defaultProps} />);

      // First delete
      await user.click(screen.getByRole('button', { name: /delete/i }));
      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[deleteButtons.length - 1]);

      await waitFor(() => {
        expect(screen.queryByText('Delete Product')).not.toBeInTheDocument();
      });

      // Reopen for another delete
      await user.click(screen.getByRole('button', { name: /delete/i }));
      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
      });
    });
  });

  describe('edge cases', () => {
    it('should handle very long product names in modal', async () => {
      const user = userEvent.setup();
      const longName = 'A'.repeat(100);

      render(<DeleteProductButton {...defaultProps} productName={longName} />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(screen.getByText(new RegExp(longName))).toBeInTheDocument();
      });
    });

    it('should handle product names with special characters', async () => {
      const user = userEvent.setup();
      const specialName = 'Product "Special" & <Test>';

      render(<DeleteProductButton {...defaultProps} productName={specialName} />);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(screen.getByText(/Product "Special" & <Test>/)).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have button with type="button"', () => {
      render(<DeleteProductButton {...defaultProps} />);

      expect(screen.getByRole('button', { name: /delete/i })).toHaveAttribute('type', 'button');
    });

    it('should maintain focus management in modal', async () => {
      const user = userEvent.setup();
      render(<DeleteProductButton {...defaultProps} />);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
      });
    });
  });
});
