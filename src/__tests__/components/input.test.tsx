import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components';

describe('Input', () => {
  describe('rendering', () => {
    it('should render input element', () => {
      render(<Input />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />);

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with value', () => {
      render(<Input value="Test value" readOnly />);

      expect(screen.getByRole('textbox')).toHaveValue('Test value');
    });

    it('should apply custom className', () => {
      render(<Input className="custom-class" />);

      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });
  });

  describe('error state', () => {
    it('should apply error styles when error prop is provided', () => {
      render(<Input error="Error message" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
      expect(input).toHaveClass('focus:ring-red-500');
    });

    it('should apply normal styles when no error', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-gray-300');
      expect(input).toHaveClass('focus:ring-blue-500');
      expect(input).not.toHaveClass('border-red-500');
    });

    it('should not apply error styles when error is empty string', () => {
      render(<Input error="" />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveClass('border-red-500');
    });
  });

  describe('disabled state', () => {
    it('should disable input when disabled prop is true', () => {
      render(<Input disabled />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should apply disabled styles', () => {
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('disabled:bg-gray-50');
      expect(input).toHaveClass('disabled:cursor-not-allowed');
    });

    it('should not be disabled by default', () => {
      render(<Input />);

      expect(screen.getByRole('textbox')).not.toBeDisabled();
    });
  });

  describe('input types', () => {
    it('should accept email type', () => {
      render(<Input type="email" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('should accept number type', () => {
      render(<Input type="number" />);

      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
    });

    it('should accept text type (default)', () => {
      render(<Input type="text" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });
  });

  describe('interactions', () => {
    it('should handle onChange events', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<Input onChange={onChange} />);

      await user.type(screen.getByRole('textbox'), 'test');

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledTimes(4); // Once per character
    });

    it('should handle onFocus events', async () => {
      const onFocus = jest.fn();
      const user = userEvent.setup();

      render(<Input onFocus={onFocus} />);

      await user.click(screen.getByRole('textbox'));

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle onBlur events', async () => {
      const onBlur = jest.fn();
      const user = userEvent.setup();

      render(<Input onBlur={onBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should not trigger onChange when disabled', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<Input onChange={onChange} disabled />);

      await user.type(screen.getByRole('textbox'), 'test');

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('HTML attributes', () => {
    it('should accept name attribute', () => {
      render(<Input name="username" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username');
    });

    it('should accept id attribute', () => {
      render(<Input id="email-input" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email-input');
    });

    it('should accept required attribute', () => {
      render(<Input required />);

      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('should accept maxLength attribute', () => {
      render(<Input maxLength={10} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10');
    });

    it('should accept minLength attribute', () => {
      render(<Input minLength={3} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('minLength', '3');
    });

    it('should accept aria attributes', () => {
      render(<Input aria-label="Custom label" aria-describedby="helper-text" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Custom label');
      expect(input).toHaveAttribute('aria-describedby', 'helper-text');
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = jest.fn();

      render(<Input ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });

    it('should allow accessing input via ref', () => {
      let inputRef: HTMLInputElement | null = null;

      const TestComponent = () => (
        <Input
          ref={(el) => {
            inputRef = el;
          }}
        />
      );

      render(<TestComponent />);

      expect(inputRef).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('controlled input', () => {
    it('should work as controlled component', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');

        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            data-testid="controlled-input"
          />
        );
      };

      const user = userEvent.setup();
      render(<TestComponent />);

      const input = screen.getByTestId('controlled-input');

      await user.type(input, 'hello');

      expect(input).toHaveValue('hello');
    });
  });

  describe('combinations', () => {
    it('should work with error and disabled states together', () => {
      render(<Input error="Error message" disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('border-red-500');
    });

    it('should work with all props combined', () => {
      render(
        <Input
          type="email"
          placeholder="Enter email"
          error="Invalid email"
          className="custom-class"
          name="email"
          required
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'Enter email');
      expect(input).toHaveClass('border-red-500');
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveAttribute('name', 'email');
      expect(input).toBeRequired();
    });
  });
});
