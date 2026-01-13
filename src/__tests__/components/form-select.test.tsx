import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '@/components';


describe('Select', () => {
  describe('rendering', () => {
    it('should render select element', () => {
      render(
        <Select>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render with options', () => {
      render(
        <Select>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      );

      expect(screen.getByRole('option', { name: 'Active' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Inactive' })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Select className="custom-class">
          <option>Option</option>
        </Select>
      );

      expect(screen.getByRole('combobox')).toHaveClass('custom-class');
    });
  });

  describe('error state', () => {
    it('should apply error styles when error prop is provided', () => {
      render(
        <Select error="Error message">
          <option>Option</option>
        </Select>
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-red-500');
      expect(select).toHaveClass('focus:ring-red-500');
    });

    it('should apply normal styles when no error', () => {
      render(
        <Select>
          <option>Option</option>
        </Select>
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-gray-300');
      expect(select).toHaveClass('focus:ring-blue-500');
    });
  });

  describe('disabled state', () => {
    it('should disable select when disabled prop is true', () => {
      render(
        <Select disabled>
          <option>Option</option>
        </Select>
      );

      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('should not be disabled by default', () => {
      render(
        <Select>
          <option>Option</option>
        </Select>
      );

      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('should handle onChange events', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Select onChange={onChange}>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      );

      await user.selectOptions(screen.getByRole('combobox'), '2');

      expect(onChange).toHaveBeenCalled();
    });

    it('should update selected value', async () => {
      const user = userEvent.setup();

      render(
        <Select defaultValue="1">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      );

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('1');

      await user.selectOptions(select, '2');

      expect(select.value).toBe('2');
    });
  });

  describe('HTML attributes', () => {
    it('should accept name attribute', () => {
      render(
        <Select name="status">
          <option>Option</option>
        </Select>
      );

      expect(screen.getByRole('combobox')).toHaveAttribute('name', 'status');
    });

    it('should accept id attribute', () => {
      render(
        <Select id="status-select">
          <option>Option</option>
        </Select>
      );

      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'status-select');
    });

    it('should accept required attribute', () => {
      render(
        <Select required>
          <option>Option</option>
        </Select>
      );

      expect(screen.getByRole('combobox')).toBeRequired();
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref to select element', () => {
      const ref = jest.fn();

      render(
        <Select ref={ref}>
          <option>Option</option>
        </Select>
      );

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLSelectElement);
    });
  });
});
