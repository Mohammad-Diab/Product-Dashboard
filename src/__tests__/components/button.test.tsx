import { Button } from '@/components';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


describe('Button', () => {
  describe('rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('should apply default variant and size', () => {
      render(<Button>Default</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Button</Button>);

      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('variants', () => {
    it('should apply primary variant styles', () => {
      render(<Button variant="primary">Primary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600');
      expect(button).toHaveClass('text-white');
    });

    it('should apply secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-200');
      expect(button).toHaveClass('text-gray-900');
    });

    it('should apply danger variant styles', () => {
      render(<Button variant="danger">Danger</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600');
      expect(button).toHaveClass('text-white');
    });
  });

  describe('sizes', () => {
    it('should apply small size styles', () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('py-1.5');
      expect(button).toHaveClass('text-sm');
    });

    it('should apply medium size styles', () => {
      render(<Button size="md">Medium</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
      expect(button).toHaveClass('text-base');
    });

    it('should apply large size styles', () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('py-3');
      expect(button).toHaveClass('text-lg');
    });
  });

  describe('loading state', () => {
    it('should disable button when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show loading spinner when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);

      expect(screen.getByRole('button')).toHaveTextContent('Loading...');
    });

    it('should not show loading spinner when isLoading is false', () => {
      render(<Button isLoading={false}>Not Loading</Button>);

      expect(screen.getByRole('button')).toHaveTextContent('Not Loading');
      expect(screen.getByRole('button')).not.toHaveTextContent('Loading...');
    });
  });

  describe('disabled state', () => {
    it('should disable button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not disable button when disabled prop is false', () => {
      render(<Button disabled={false}>Enabled</Button>);

      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('should disable button when both disabled and isLoading are true', () => {
      render(
        <Button disabled isLoading>
          Disabled and Loading
        </Button>
      );

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('should call onClick when clicked', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={onClick}>Click me</Button>);

      await user.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={onClick} disabled>
          Disabled
        </Button>
      );

      await user.click(screen.getByRole('button'));

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={onClick} isLoading>
          Loading
        </Button>
      );

      await user.click(screen.getByRole('button'));

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('HTML attributes', () => {
    it('should accept and apply type attribute', () => {
      render(<Button type="submit">Submit</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should accept and apply aria attributes', () => {
      render(<Button aria-label="Custom label">Button</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom label');
    });

    it('should accept and apply data attributes', () => {
      render(<Button data-testid="custom-button">Button</Button>);

      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref to button element', () => {
      const ref = jest.fn();

      render(<Button ref={ref}>Button</Button>);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('combinations', () => {
    it('should apply variant and size together', () => {
      render(
        <Button variant="danger" size="lg">
          Large Danger
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600');
      expect(button).toHaveClass('px-6');
    });

    it('should work with all props combined', () => {
      const onClick = jest.fn();

      render(
        <Button
          variant="secondary"
          size="sm"
          className="extra-class"
          onClick={onClick}
          type="button"
          aria-label="Test"
        >
          Complex Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-200');
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('extra-class');
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('aria-label', 'Test');
    });
  });
});
