import { ConfirmModal } from '@/components';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render when isOpen is true', async () => {
      render(<ConfirmModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
      });
    });

    it('should not render when isOpen is false', () => {
      render(<ConfirmModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
    });

    it('should render with custom confirm text', async () => {
      render(<ConfirmModal {...defaultProps} confirmText="Delete" />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
      });
    });

    it('should render with custom cancel text', async () => {
      render(<ConfirmModal {...defaultProps} cancelText="Go Back" />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
      });
    });

    it('should render default confirm and cancel text', async () => {
      render(<ConfirmModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      });
    });

    it('should render complex message content', async () => {
      render(
        <ConfirmModal
          {...defaultProps}
          message={
            <div>
              <p>First paragraph</p>
              <p>Second paragraph</p>
            </div>
          }
        />
      );

      await waitFor(() => {
        expect(screen.getByText('First paragraph')).toBeInTheDocument();
        expect(screen.getByText('Second paragraph')).toBeInTheDocument();
      });
    });
  });

  describe('variants', () => {
    it('should apply danger variant to confirm button', async () => {
      render(<ConfirmModal {...defaultProps} variant="danger" />);

      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        expect(confirmButton).toHaveClass('bg-red-600');
      });
    });

    it('should apply primary variant to confirm button (default)', async () => {
      render(<ConfirmModal {...defaultProps} variant="primary" />);

      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        expect(confirmButton).toHaveClass('bg-blue-600');
      });
    });

    it('should use primary variant by default', async () => {
      render(<ConfirmModal {...defaultProps} />);

      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        expect(confirmButton).toHaveClass('bg-blue-600');
      });
    });
  });

  describe('interactions', () => {
    it('should call onConfirm when confirm button is clicked', async () => {
      const onConfirm = jest.fn();
      const user = userEvent.setup();

      render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when cancel button is clicked', async () => {
      const onClose = jest.fn();
      const user = userEvent.setup();

      render(<ConfirmModal {...defaultProps} onClose={onClose} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onConfirm when cancel is clicked', async () => {
      const onConfirm = jest.fn();
      const user = userEvent.setup();

      render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should disable cancel button when loading', async () => {
      render(<ConfirmModal {...defaultProps} isLoading={true} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
      });
    });

    it('should show loading spinner on confirm button', async () => {
      render(<ConfirmModal {...defaultProps} isLoading={true} />);

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });

    it('should not disable buttons when not loading', async () => {
      render(<ConfirmModal {...defaultProps} isLoading={false} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Confirm' })).not.toBeDisabled();
        expect(screen.getByRole('button', { name: 'Cancel' })).not.toBeDisabled();
      });
    });

    it('should not allow confirm click when loading', async () => {
      const onConfirm = jest.fn();
      const user = userEvent.setup();

      render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} isLoading={true} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /loading/i }));

      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe('modal behavior', () => {
    it('should close on Escape key', async () => {
      const onClose = jest.fn();
      const user = userEvent.setup();

      render(<ConfirmModal {...defaultProps} onClose={onClose} />);

      await waitFor(() => {
        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });

  });

  describe('real-world scenarios', () => {
    it('should handle delete product confirmation', async () => {
      const onConfirm = jest.fn();
      const user = userEvent.setup();

      render(
        <ConfirmModal
          isOpen={true}
          onClose={jest.fn()}
          onConfirm={onConfirm}
          title="Delete Product"
          message={
            <>
              <p>
                Are you sure you want to delete <span className="font-semibold">"Test Product"</span>?
              </p>
              <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
            </>
          }
          confirmText="Delete"
          variant="danger"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Delete Product')).toBeInTheDocument();
        expect(screen.getByText(/Test Product/)).toBeInTheDocument();
        expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should handle async operation with loading state', async () => {
      const onConfirm = jest.fn();
      const { rerender } = render(
        <ConfirmModal
          {...defaultProps}
          onConfirm={onConfirm}
          isLoading={false}
          variant="danger"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Confirm' })).not.toBeDisabled();
      });

      // Simulate loading state after confirm
      rerender(
        <ConfirmModal
          {...defaultProps}
          onConfirm={onConfirm}
          isLoading={true}
          variant="danger"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
      });
    });

    it('should work with all props combined', async () => {
      const onConfirm = jest.fn();
      const onClose = jest.fn();
      const user = userEvent.setup();

      render(
        <ConfirmModal
          isOpen={true}
          onClose={onClose}
          onConfirm={onConfirm}
          title="Custom Confirmation"
          message="Custom message"
          confirmText="Yes, Proceed"
          cancelText="No, Cancel"
          variant="danger"
          isLoading={false}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Custom Confirmation')).toBeInTheDocument();
        expect(screen.getByText('Custom message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Yes, Proceed' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'No, Cancel' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Yes, Proceed' }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty message', async () => {
      render(<ConfirmModal {...defaultProps} message="" />);

      await waitFor(() => {
        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      });
    });

    it('should handle rapid open/close', async () => {
      const { rerender } = render(<ConfirmModal {...defaultProps} isOpen={true} />);

      await waitFor(() => {
        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      });

      rerender(<ConfirmModal {...defaultProps} isOpen={false} />);
      rerender(<ConfirmModal {...defaultProps} isOpen={true} />);

      await waitFor(() => {
        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      });
    });
  });
});
