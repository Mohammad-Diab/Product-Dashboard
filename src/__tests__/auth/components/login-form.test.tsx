import { useAuth } from '@/features/auth';
import { LoginForm } from '@/features/auth/components';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/features/auth/hooks/use-auth');
jest.mock('next/navigation');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      register: jest.fn(),
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
    it('should render email input field', () => {
      render(<LoginForm />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    });

    it('should render password input field', () => {
      render(<LoginForm />);

      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<LoginForm />);

      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    it('should have email input with correct type', () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have password input with correct type', () => {
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should mark required fields with asterisk', () => {
      render(<LoginForm />);

      expect(screen.getByText(/email/i).parentElement).toHaveTextContent('*');
      expect(screen.getByText(/password/i).parentElement).toHaveTextContent('*');
    });

    it('should have autocomplete attributes', () => {
      render(<LoginForm />);

      expect(screen.getByLabelText(/email/i)).toHaveAttribute('autocomplete', 'email');
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('autocomplete', 'current-password');
    });
  });

  describe('form validation', () => {
    it('should show error when email is empty', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should show error when password is empty', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error for short password', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, '12345');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should not show errors when form is valid', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(screen.queryByText(/invalid email format/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/password must be at least 8 characters/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('form submission', () => {
    it('should call login with correct credentials', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should navigate to home page on successful login', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      let resolveLogin: () => void;
      const loginPromise = new Promise<void>((resolve) => {
        resolveLogin = resolve;
      });
      mockLogin.mockReturnValue(loginPromise);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
      });

      resolveLogin!();
    });

    it('should disable submit button during submission', async () => {
      const user = userEvent.setup();
      let resolveLogin: () => void;
      const loginPromise = new Promise<void>((resolve) => {
        resolveLogin = resolve;
      });
      mockLogin.mockReturnValue(loginPromise);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /loading/i });
        expect(button).toBeDisabled();
      });

      resolveLogin!();
    });
  });

  describe('error handling', () => {
    it('should display server error message on failed login', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue(new Error('Invalid credentials'));

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('should display generic error message on network error', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue(new Error());

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('user interactions', () => {
    it('should allow typing in email field', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      await user.type(emailInput, 'user@test.com');

      expect(emailInput.value).toBe('user@test.com');
    });

    it('should allow typing in password field', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      await user.type(passwordInput, 'mypassword');

      expect(passwordInput.value).toBe('mypassword');
    });

    it('should allow clearing and retyping', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

      await user.type(emailInput, 'first@test.com');
      expect(emailInput.value).toBe('first@test.com');

      await user.clear(emailInput);
      expect(emailInput.value).toBe('');

      await user.type(emailInput, 'second@test.com');
      expect(emailInput.value).toBe('second@test.com');
    });

    it('should submit form on Enter key in password field', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123{Enter}');

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete login flow', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);

      render(<LoginForm />);

      // Type credentials
      await user.type(screen.getByLabelText(/email/i), 'admin@example.com');
      await user.type(screen.getByLabelText(/password/i), 'admin123');

      // Submit form
      await user.click(screen.getByRole('button', { name: /log in/i }));

      // Verify login was called
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'admin@example.com',
          password: 'admin123',
        });
      });

      // Verify navigation
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should handle validation errors before submission', async () => {
      const user = userEvent.setup();

      render(<LoginForm />);

      // Try to submit empty form
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });

      // Login should not be called
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should recover from error and allow retry', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValueOnce(new Error('Server error')).mockResolvedValueOnce(undefined);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      // First attempt - fails
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });

      // Second attempt - succeeds
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });
  });
});
