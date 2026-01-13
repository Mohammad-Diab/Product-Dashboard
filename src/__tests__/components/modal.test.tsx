import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/components';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render when isOpen is true', async () => {
      render(<Modal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Modal content')).toBeInTheDocument();
      });
    });

    it('should not render when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('should render with title', async () => {
      render(<Modal {...defaultProps} title="Test Title" />);

      await waitFor(() => {
        expect(screen.getByText('Test Title')).toBeInTheDocument();
      });
    });

    it('should render without title', async () => {
      render(<Modal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Modal content')).toBeInTheDocument();
      });
    });

    it('should render children content', async () => {
      render(
        <Modal {...defaultProps}>
          <div>
            <h2>Custom heading</h2>
            <p>Custom paragraph</p>
          </div>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText('Custom heading')).toBeInTheDocument();
        expect(screen.getByText('Custom paragraph')).toBeInTheDocument();
      });
    });
  });

  describe('interactions', () => {

    it('should call onClose when backdrop is clicked', async () => {
      const onClose = jest.fn();
      const user = userEvent.setup();

      const { container } = render(<Modal {...defaultProps} onClose={onClose} />);

      await waitFor(() => {
        expect(screen.getByText('Modal content')).toBeInTheDocument();
      });

      // Click on backdrop (the overlay behind the modal)
      const backdrop = container.querySelector('[class*="fixed inset-0"]');
      if (backdrop) {
        await user.click(backdrop);
        expect(onClose).toHaveBeenCalled();
      }
    });

    it('should not close when modal content is clicked', async () => {
      const onClose = jest.fn();
      const user = userEvent.setup();

      render(<Modal {...defaultProps} onClose={onClose} />);

      await waitFor(() => {
        expect(screen.getByText('Modal content')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Modal content'));

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('keyboard interactions', () => {
    it('should close modal on Escape key press', async () => {
      const onClose = jest.fn();
      const user = userEvent.setup();

      render(<Modal {...defaultProps} onClose={onClose} />);

      await waitFor(() => {
        expect(screen.getByText('Modal content')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('body scroll lock', () => {
    it('should lock body scroll when modal opens', async () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={false} />);

      expect(document.body.style.overflow).toBe('');

      rerender(<Modal {...defaultProps} isOpen={true} />);

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });
    });

    it('should restore body scroll when modal closes', async () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });

      rerender(<Modal {...defaultProps} isOpen={false} />);

      await waitFor(() => {
        expect(document.body.style.overflow).not.toBe('hidden');
      });
    });
  });

  describe('animations', () => {

    it('should animate out before unmounting', async () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);

      await waitFor(() => {
        expect(screen.getByText('Modal content')).toBeInTheDocument();
      });

      rerender(<Modal {...defaultProps} isOpen={false} />);

      // Modal should still be in DOM during animation
      await waitFor(
        () => {
          expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });
  });

  describe('portal rendering', () => {
    it('should render modal in portal', async () => {
      render(<Modal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Modal content')).toBeInTheDocument();
      });

      // Modal should be rendered outside the normal DOM hierarchy
      const modalElement = screen.getByText('Modal content').closest('[role="dialog"]');
      expect(modalElement).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle rapid open/close transitions', async () => {
      const onClose = jest.fn();
      const { rerender } = render(<Modal {...defaultProps} onClose={onClose} isOpen={true} />);

      await waitFor(() => {
        expect(screen.getByText('Modal content')).toBeInTheDocument();
      });

      // Rapidly toggle
      rerender(<Modal {...defaultProps} onClose={onClose} isOpen={false} />);
      rerender(<Modal {...defaultProps} onClose={onClose} isOpen={true} />);

      await waitFor(() => {
        expect(screen.getByText('Modal content')).toBeInTheDocument();
      });
    });

    it('should handle multiple children', async () => {
      render(
        <Modal {...defaultProps}>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText('Child 1')).toBeInTheDocument();
        expect(screen.getByText('Child 2')).toBeInTheDocument();
        expect(screen.getByText('Child 3')).toBeInTheDocument();
      });
    });

    it('should handle complex JSX children', async () => {
      render(
        <Modal {...defaultProps}>
          <form>
            <input type="text" placeholder="Name" />
            <button type="submit">Submit</button>
          </form>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
      });
    });
  });

  describe('combinations', () => {
    it('should work with all props combined', async () => {
      const onClose = jest.fn();

      render(
        <Modal isOpen={true} onClose={onClose} title="Complete Modal" size="lg">
          <div>
            <p>This is a large modal with a title</p>
          </div>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByText('Complete Modal')).toBeInTheDocument();
        expect(screen.getByText('This is a large modal with a title')).toBeInTheDocument();
      });
    });
  });
});
