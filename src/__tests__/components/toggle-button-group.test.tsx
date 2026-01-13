import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleButtonGroup } from '@/components';

describe('ToggleButtonGroup', () => {
  const defaultOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const defaultProps = {
    options: defaultOptions,
    value: 'active',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render all options', () => {
      render(<ToggleButtonGroup {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Active' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Inactive' })).toBeInTheDocument();
    });

    it('should render with three options', () => {
      const options = [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ];

      render(<ToggleButtonGroup {...defaultProps} options={options} value="all" />);

      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Active' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Inactive' })).toBeInTheDocument();
    });

    it('should render with boolean values', () => {
      const options = [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ];

      render(<ToggleButtonGroup {...defaultProps} options={options} value={true} />);

      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
    });
  });

  describe('selection state', () => {
    it('should highlight selected option', () => {
      render(<ToggleButtonGroup {...defaultProps} value="active" />);

      const activeButton = screen.getByRole('button', { name: 'Active' });
      expect(activeButton).toHaveClass('bg-blue-600');
      expect(activeButton).toHaveClass('text-white');
    });

    it('should not highlight unselected options', () => {
      render(<ToggleButtonGroup {...defaultProps} value="active" />);

      const inactiveButton = screen.getByRole('button', { name: 'Inactive' });
      expect(inactiveButton).toHaveClass('bg-white');
      expect(inactiveButton).toHaveClass('text-gray-700');
    });

    it('should update selection when value changes', () => {
      const { rerender } = render(<ToggleButtonGroup {...defaultProps} value="active" />);

      expect(screen.getByRole('button', { name: 'Active' })).toHaveClass('bg-blue-600');

      rerender(<ToggleButtonGroup {...defaultProps} value="inactive" />);

      expect(screen.getByRole('button', { name: 'Inactive' })).toHaveClass('bg-blue-600');
      expect(screen.getByRole('button', { name: 'Active' })).toHaveClass('bg-white');
    });
  });

  describe('interactions', () => {
    it('should call onChange when option is clicked', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<ToggleButtonGroup {...defaultProps} onChange={onChange} />);

      await user.click(screen.getByRole('button', { name: 'Inactive' }));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('inactive');
    });

    it('should call onChange with correct value', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<ToggleButtonGroup {...defaultProps} onChange={onChange} />);

      await user.click(screen.getByRole('button', { name: 'Active' }));

      expect(onChange).toHaveBeenCalledWith('active');
    });

    it('should call onChange with boolean value', async () => {
      const onChange = jest.fn();
      const options = [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ];
      const user = userEvent.setup();

      render(<ToggleButtonGroup options={options} value={true} onChange={onChange} />);

      await user.click(screen.getByRole('button', { name: 'No' }));

      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('should allow clicking already selected option', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<ToggleButtonGroup {...defaultProps} onChange={onChange} value="active" />);

      await user.click(screen.getByRole('button', { name: 'Active' }));

      expect(onChange).toHaveBeenCalledWith('active');
    });

    it('should handle multiple clicks', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<ToggleButtonGroup {...defaultProps} onChange={onChange} />);

      await user.click(screen.getByRole('button', { name: 'Inactive' }));
      await user.click(screen.getByRole('button', { name: 'Active' }));
      await user.click(screen.getByRole('button', { name: 'Inactive' }));

      expect(onChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('styling', () => {
    it('should apply rounded corners to first button', () => {
      render(<ToggleButtonGroup {...defaultProps} />);

      const firstButton = screen.getByRole('button', { name: 'Active' });
      expect(firstButton).toHaveClass('rounded-l-md');
    });

    it('should apply rounded corners to last button', () => {
      render(<ToggleButtonGroup {...defaultProps} />);

      const lastButton = screen.getByRole('button', { name: 'Inactive' });
      expect(lastButton).toHaveClass('rounded-r-md');
    });

    it('should have shadow on group', () => {
      const { container } = render(<ToggleButtonGroup {...defaultProps} />);

      const group = container.querySelector('[role="group"]');
      expect(group).toHaveClass('shadow-sm');
    });
  });

  describe('accessibility', () => {
    it('should have role="group"', () => {
      render(<ToggleButtonGroup {...defaultProps} />);

      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('should apply aria-label when provided', () => {
      render(<ToggleButtonGroup {...defaultProps} ariaLabel="Status filter" />);

      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-label', 'Status filter');
    });

    it('should not have aria-label when not provided', () => {
      render(<ToggleButtonGroup {...defaultProps} />);

      const group = screen.getByRole('group');
      expect(group).not.toHaveAttribute('aria-label');
    });

    it('should have button type for all options', () => {
      render(<ToggleButtonGroup {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('real-world scenarios', () => {
    it('should work as status filter', async () => {
      const onChange = jest.fn();
      const options = [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ];
      const user = userEvent.setup();

      render(
        <ToggleButtonGroup
          options={options}
          value="all"
          onChange={onChange}
          ariaLabel="Filter products by status"
        />
      );

      await user.click(screen.getByRole('button', { name: 'Active' }));

      expect(onChange).toHaveBeenCalledWith('active');
    });

    it('should work as order status toggle', async () => {
      const onChange = jest.fn();
      const options = [
        { label: 'Pending', value: 'pending' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
      ];
      const user = userEvent.setup();

      render(
        <ToggleButtonGroup
          options={options}
          value="pending"
          onChange={onChange}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Shipped' }));

      expect(onChange).toHaveBeenCalledWith('shipped');
    });

    it('should work as boolean toggle', async () => {
      const onChange = jest.fn();
      const options = [
        { label: 'Enabled', value: true },
        { label: 'Disabled', value: false },
      ];
      const user = userEvent.setup();

      render(
        <ToggleButtonGroup
          options={options}
          value={true}
          onChange={onChange}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Disabled' }));

      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  describe('edge cases', () => {
    it('should handle single option', () => {
      const options = [{ label: 'Only', value: 'only' }];

      render(<ToggleButtonGroup options={options} value="only" onChange={jest.fn()} />);

      const button = screen.getByRole('button', { name: 'Only' });
      expect(button).toHaveClass('rounded-l-md');
      expect(button).toHaveClass('rounded-r-md');
    });

    it('should handle many options', () => {
      const options = Array.from({ length: 10 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `opt${i + 1}`,
      }));

      render(<ToggleButtonGroup options={options} value="opt1" onChange={jest.fn()} />);

      options.forEach((option) => {
        expect(screen.getByRole('button', { name: option.label })).toBeInTheDocument();
      });
    });

    it('should handle long label text', () => {
      const options = [
        { label: 'Very Long Label Text That Might Wrap', value: 'long' },
        { label: 'Short', value: 'short' },
      ];

      render(<ToggleButtonGroup options={options} value="long" onChange={jest.fn()} />);

      expect(
        screen.getByRole('button', { name: 'Very Long Label Text That Might Wrap' })
      ).toBeInTheDocument();
    });

    it('should handle rapid selection changes', async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<ToggleButtonGroup {...defaultProps} onChange={onChange} />);

      await user.click(screen.getByRole('button', { name: 'Inactive' }));
      await user.click(screen.getByRole('button', { name: 'Active' }));
      await user.click(screen.getByRole('button', { name: 'Inactive' }));

      expect(onChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('visual states', () => {
    it('should show hover state classes', () => {
      render(<ToggleButtonGroup {...defaultProps} value="active" />);

      const activeButton = screen.getByRole('button', { name: 'Active' });
      const inactiveButton = screen.getByRole('button', { name: 'Inactive' });

      expect(activeButton).toHaveClass('hover:bg-blue-700');
      expect(inactiveButton).toHaveClass('hover:bg-gray-50');
    });

    it('should show focus state classes', () => {
      render(<ToggleButtonGroup {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('focus:z-10');
        expect(button).toHaveClass('focus:outline-none');
        expect(button).toHaveClass('focus:ring-2');
        expect(button).toHaveClass('focus:ring-blue-500');
      });
    });
  });
});
