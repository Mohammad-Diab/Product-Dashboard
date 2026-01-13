import { FormField, ErrorMessage, LoadingSpinner } from '@/components';
import { render, screen } from '@testing-library/react';


describe('FormField', () => {
  describe('rendering', () => {
    it('should render label and children', () => {
      render(
        <FormField label="Email">
          <input type="email" />
        </FormField>
      );

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render required asterisk when required', () => {
      render(
        <FormField label="Name" required>
          <input type="text" />
        </FormField>
      );

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should not render asterisk when not required', () => {
      render(
        <FormField label="Name">
          <input type="text" />
        </FormField>
      );

      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('should link label to input via htmlFor', () => {
      render(
        <FormField label="Email" htmlFor="email-input">
          <input type="email" id="email-input" />
        </FormField>
      );

      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email-input');
    });
  });

  describe('error display', () => {
    it('should display error message when provided', () => {
      render(
        <FormField label="Email" error="Invalid email">
          <input type="email" />
        </FormField>
      );

      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
    });

    it('should not display error when no error prop', () => {
      render(
        <FormField label="Email">
          <input type="email" />
        </FormField>
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should not display error when error is empty string', () => {
      render(
        <FormField label="Email" error="">
          <input type="email" />
        </FormField>
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('children rendering', () => {
    it('should render input children', () => {
      render(
        <FormField label="Name">
          <input type="text" placeholder="Enter name" />
        </FormField>
      );

      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    });

    it('should render select children', () => {
      render(
        <FormField label="Status">
          <select>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </FormField>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render textarea children', () => {
      render(
        <FormField label="Description">
          <textarea placeholder="Enter description" />
        </FormField>
      );

      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <FormField label="Options">
          <div>
            <input type="checkbox" id="opt1" />
            <label htmlFor="opt1">Option 1</label>
          </div>
        </FormField>
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  describe('combinations', () => {
    it('should render with all props', () => {
      render(
        <FormField label="Email" htmlFor="email" required error="Invalid email">
          <input type="email" id="email" />
        </FormField>
      );

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
    });
  });
});

describe('ErrorMessage', () => {
  describe('rendering', () => {
    it('should render error message', () => {
      render(<ErrorMessage message="Error occurred" />);

      expect(screen.getByRole('alert')).toHaveTextContent('Error occurred');
    });

    it('should not render when message is undefined', () => {
      render(<ErrorMessage />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should not render when message is empty string', () => {
      render(<ErrorMessage message="" />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<ErrorMessage message="Error" className="custom-class" />);

      expect(screen.getByRole('alert')).toHaveClass('custom-class');
    });

    it('should have aria-live attribute', () => {
      render(<ErrorMessage message="Error" />);

      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('styling', () => {
    it('should have default error styles', () => {
      render(<ErrorMessage message="Error" />);

      const element = screen.getByRole('alert');
      expect(element).toHaveClass('text-sm');
      expect(element).toHaveClass('text-red-600');
    });

    it('should combine default and custom classes', () => {
      render(<ErrorMessage message="Error" className="extra-class" />);

      const element = screen.getByRole('alert');
      expect(element).toHaveClass('text-sm');
      expect(element).toHaveClass('text-red-600');
      expect(element).toHaveClass('extra-class');
    });
  });
});

describe('LoadingSpinner', () => {
  describe('rendering', () => {
    it('should render spinner', () => {
      render(<LoadingSpinner />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-label for accessibility', () => {
      render(<LoadingSpinner />);

      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('should have animate-spin class', () => {
      render(<LoadingSpinner />);

      expect(screen.getByRole('status')).toHaveClass('animate-spin');
    });
  });

  describe('sizes', () => {
    it('should apply small size styles', () => {
      render(<LoadingSpinner size="sm" />);

      expect(screen.getByRole('status')).toHaveClass('h-4');
      expect(screen.getByRole('status')).toHaveClass('w-4');
    });

    it('should apply medium size styles (default)', () => {
      render(<LoadingSpinner />);

      expect(screen.getByRole('status')).toHaveClass('h-8');
      expect(screen.getByRole('status')).toHaveClass('w-8');
    });

    it('should apply medium size styles explicitly', () => {
      render(<LoadingSpinner size="md" />);

      expect(screen.getByRole('status')).toHaveClass('h-8');
      expect(screen.getByRole('status')).toHaveClass('w-8');
    });

    it('should apply large size styles', () => {
      render(<LoadingSpinner size="lg" />);

      expect(screen.getByRole('status')).toHaveClass('h-12');
      expect(screen.getByRole('status')).toHaveClass('w-12');
    });
  });

  describe('custom styling', () => {
    it('should apply custom className', () => {
      render(<LoadingSpinner className="custom-class" />);

      expect(screen.getByRole('status')).toHaveClass('custom-class');
    });

    it('should combine size and custom classes', () => {
      render(<LoadingSpinner size="lg" className="text-blue-500" />);

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-12');
      expect(spinner).toHaveClass('w-12');
      expect(spinner).toHaveClass('text-blue-500');
    });
  });

  describe('SVG structure', () => {
    it('should render as SVG element', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should have correct viewBox', () => {
      const { container } = render(<LoadingSpinner />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should have circle and path elements', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.querySelector('circle')).toBeInTheDocument();
      expect(container.querySelector('path')).toBeInTheDocument();
    });
  });
});
