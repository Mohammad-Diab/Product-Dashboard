import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '@/features/auth/components';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';

// Mock dependencies
jest.mock('@/features/auth/hooks/use-auth');
jest.mock('next/navigation');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('RegisterForm', () => {
  const mockRegister = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      register: mockRegister,
      logout: jest.fn(),
      refreshUser: jest.fn(),
    });

    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  describe('rendering', () => {
    it('should render all form fields', () => {
      render(<RegisterForm />);

      expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<RegisterForm />);

      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('should mark all fields as required', () => {
      const { container } = render(<RegisterForm />);

      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label.textContent).toContain('*');
      });
    });

    it('should have correct input types', () => {
      render(<RegisterForm />);

      expect(screen.getByLabelText(/^name/i)).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText(/^password/i)).toHaveAttribute('type', 'password');
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute('type', 'password');
    });

    it('should have autocomplete attributes', () => {
      render(<RegisterForm />);

      expect(screen.getByLabelText(/^name/i)).toHaveAttribute('autocomplete', 'name');
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('autocomplete', 'email');
      expect(screen.getByLabelText(/^password/i)).toHaveAttribute('autocomplete', 'new-password');
    });
  });

  describe('form validation', () => {
    it('should show error when name is empty', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for short name', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'Jo');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/name must be at least 3 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error when email is empty', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'test@invalid');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should show error when password is empty', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error for short password', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^password/i), '12345');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error when confirm password is empty', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/Please confirm your password/i)).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'different123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should not show errors when form is valid', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue(undefined);

      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/must be at least/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('form submission', () => {
    it('should call register with correct data', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue(undefined);

      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });
      });
    });

    it('should navigate to dashboard on successful registration', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue(undefined);

      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      let resolveRegister: () => void;
      const registerPromise = new Promise<void>((resolve) => {
        resolveRegister = resolve;
      });
      mockRegister.mockReturnValue(registerPromise);

      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
      });

      resolveRegister!();
    });

    it('should disable submit button during submission', async () => {
      const user = userEvent.setup();
      let resolveRegister: () => void;
      const registerPromise = new Promise<void>((resolve) => {
        resolveRegister = resolve;
      });
      mockRegister.mockReturnValue(registerPromise);

      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /loading/i });
        expect(button).toBeDisabled();
      });

      resolveRegister!();
    });
  });

  describe('error handling', () => {
    it('should display server error message on failed registration', async () => {
      const user = userEvent.setup();
      mockRegister.mockRejectedValue(new Error('Email already exists'));

      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });

    it('should display generic error message on network error', async () => {
      const user = userEvent.setup();
      mockRegister.mockRejectedValue(new Error());

      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
      });
    });

    it('should clear server error on new submission', async () => {
      const user = userEvent.setup();
      mockRegister.mockRejectedValueOnce(new Error('Server error')).mockResolvedValueOnce(undefined);

      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');

      // First submission - fail
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });

      // Second submission - should clear error
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.queryByText(/server error/i)).not.toBeInTheDocument();
      });
    });

    it('should not navigate on failed registration', async () => {
      const user = userEvent.setup();
      mockRegister.mockRejectedValue(new Error('Registration failed'));

      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('user interactions', () => {
    it('should allow typing in all fields', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const nameInput = screen.getByLabelText(/^name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/^password/i) as HTMLInputElement;
      const confirmInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;

      await user.type(nameInput, 'John');
      await user.type(emailInput, 'john@test.com');
      await user.type(passwordInput, 'pass123');
      await user.type(confirmInput, 'pass123');

      expect(nameInput.value).toBe('John');
      expect(emailInput.value).toBe('john@test.com');
      expect(passwordInput.value).toBe('pass123');
      expect(confirmInput.value).toBe('pass123');
    });

    it('should allow clearing and retyping fields', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const nameInput = screen.getByLabelText(/^name/i) as HTMLInputElement;

      await user.type(nameInput, 'FirstName');
      expect(nameInput.value).toBe('FirstName');

      await user.clear(nameInput);
      expect(nameInput.value).toBe('');

      await user.type(nameInput, 'SecondName');
      expect(nameInput.value).toBe('SecondName');
    });

    it('should submit form on Enter key in last field', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue(undefined);

      render(<RegisterForm />);

      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123{Enter}');

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled();
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete registration flow', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue(undefined);

      render(<RegisterForm />);

      // Fill all fields
      await user.type(screen.getByLabelText(/^name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'secure123');
      await user.type(screen.getByLabelText(/confirm password/i), 'secure123');

      // Submit form
      await user.click(screen.getByRole('button', { name: /register/i }));

      // Verify registration was called
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: 'secure123',
          confirmPassword: 'secure123',
        });
      });

      // Verify navigation to dashboard
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('should handle validation errors before submission', async () => {
      const user = userEvent.setup();

      render(<RegisterForm />);

      // Try to submit empty form
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });

      // Register should not be called
      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should recover from error and allow retry', async () => {
      const user = userEvent.setup();
      mockRegister.mockRejectedValueOnce(new Error('Server error')).mockResolvedValueOnce(undefined);

      render(<RegisterForm />);

      // Fill form
      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');

      // First attempt - fails
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });

      // Second attempt - succeeds
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should handle password mismatch correction', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue(undefined);

      render(<RegisterForm />);

      // Fill form with mismatched passwords
      await user.type(screen.getByLabelText(/^name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'different123');

      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });

      // Fix the confirm password
      const confirmInput = screen.getByLabelText(/confirm password/i);
      await user.clear(confirmInput);
      await user.type(confirmInput, 'password123');

      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });
  });
});
