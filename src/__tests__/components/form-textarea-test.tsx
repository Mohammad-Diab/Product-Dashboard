import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '@/components';

describe('Textarea', () => {
  describe('rendering', () => {
    it('should render textarea element', () => {
      render(<Textarea />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Textarea placeholder="Enter description" />);

      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });

    it('should render with value', () => {
      render(<Textarea value="Test value" readOnly />);

      expect(screen.getByRole('textbox')).toHaveValue('Test value');
    });

    it('should apply custom className', () => {
      render(<Textarea className="custom-class" />);

      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });
  });

  describe('error state', () => {
    it('should apply error styles when error prop is provided', () => {
      render(<Textarea error="Error message" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-red-500');
      expect(textarea).toHaveClass('focus:ring-red-500');
    });

    it('should apply normal styles when no error', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-gray-300');
      expect(textarea).toHaveClass('focus:ring-blue-500');
    });
  });

  describe('disabled state', () => {
    it('should disable textarea when disabled prop is true', () => {
      render(<Textarea disabled />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should not be disabled by default', () => {
      render(<Textarea />);

      expect(screen.getByRole('textbox')).not.toBeDisabled();
    });
  });

  describe('rows', () => {
    it('should accept custom rows', () => {
      render(<Textarea rows={10} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '10');
    });

    it('should work without explicit rows', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should handle onChange events', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<Textarea onChange={onChange} />);

      await user.type(screen.getByRole('textbox'), 'test');

      expect(onChange).toHaveBeenCalled();
    });

    it('should handle onFocus events', async () => {
      const onFocus = jest.fn();
      const user = userEvent.setup();

      render(<Textarea onFocus={onFocus} />);

      await user.click(screen.getByRole('textbox'));

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle onBlur events', async () => {
      const onBlur = jest.fn();
      const user = userEvent.setup();

      render(<Textarea onBlur={onBlur} />);

      const textarea = screen.getByRole('textbox');
      await user.click(textarea);
      await user.tab();

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should allow multiline input', async () => {
      const user = userEvent.setup();

      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Line 1{Enter}Line 2');

      expect(textarea).toHaveValue('Line 1\nLine 2');
    });
  });

  describe('HTML attributes', () => {
    it('should accept name attribute', () => {
      render(<Textarea name="description" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'description');
    });

    it('should accept id attribute', () => {
      render(<Textarea id="desc-textarea" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'desc-textarea');
    });

    it('should accept required attribute', () => {
      render(<Textarea required />);

      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('should accept maxLength attribute', () => {
      render(<Textarea maxLength={500} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '500');
    });

    it('should accept minLength attribute', () => {
      render(<Textarea minLength={10} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('minLength', '10');
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref to textarea element', () => {
      const ref = jest.fn();

      render(<Textarea ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe('controlled textarea', () => {
    it('should work as controlled component', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');

        return (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            data-testid="controlled-textarea"
          />
        );
      };

      const user = userEvent.setup();
      render(<TestComponent />);

      const textarea = screen.getByTestId('controlled-textarea');

      await user.type(textarea, 'hello world');

      expect(textarea).toHaveValue('hello world');
    });
  });

  describe('combinations', () => {
    it('should work with all props combined', () => {
      render(
        <Textarea
          placeholder="Enter text"
          error="Invalid input"
          className="custom-class"
          name="content"
          rows={8}
          required
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('placeholder', 'Enter text');
      expect(textarea).toHaveClass('border-red-500');
      expect(textarea).toHaveClass('custom-class');
      expect(textarea).toHaveAttribute('name', 'content');
      expect(textarea).toHaveAttribute('rows', '8');
      expect(textarea).toBeRequired();
    });
  });
});
