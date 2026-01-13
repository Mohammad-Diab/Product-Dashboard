import { AuthContextValue, useAuth } from '@/features/auth';
import { AuthContext } from '@/features/auth/context/auth-context';
import { renderHook, waitFor } from '@testing-library/react';


const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin' as const,
};

const createMockContextValue = (overrides?: Partial<AuthContextValue>): AuthContextValue => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  refreshUser: jest.fn(),
  ...overrides,
});

describe('useAuth', () => {
  describe('context availability', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      console.error = originalError;
    });

    it('should return context value when used within AuthProvider', () => {
      const mockValue = createMockContextValue({ user: mockUser, isAuthenticated: true });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current).toBe(mockValue);
    });
  });

  describe('user state', () => {
    it('should return null user when not authenticated', () => {
      const mockValue = createMockContextValue();

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should return user when authenticated', () => {
      const mockValue = createMockContextValue({ user: mockUser, isAuthenticated: true });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should expose all user properties', () => {
      const mockValue = createMockContextValue({ user: mockUser, isAuthenticated: true });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current.user).toHaveProperty('id');
      expect(result.current.user).toHaveProperty('email');
      expect(result.current.user).toHaveProperty('name');
      expect(result.current.user).toHaveProperty('role');
    });
  });

  describe('loading state', () => {
    it('should return isLoading as false by default', () => {
      const mockValue = createMockContextValue();

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should return isLoading as true when loading', () => {
      const mockValue = createMockContextValue({ isLoading: true });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('auth methods', () => {
    it('should expose login method', () => {
      const mockLogin = jest.fn();
      const mockValue = createMockContextValue({ login: mockLogin });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current.login).toBe(mockLogin);
      expect(typeof result.current.login).toBe('function');
    });

    it('should expose register method', () => {
      const mockRegister = jest.fn();
      const mockValue = createMockContextValue({ register: mockRegister });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current.register).toBe(mockRegister);
      expect(typeof result.current.register).toBe('function');
    });

    it('should expose logout method', () => {
      const mockLogout = jest.fn();
      const mockValue = createMockContextValue({ logout: mockLogout });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current.logout).toBe(mockLogout);
      expect(typeof result.current.logout).toBe('function');
    });

    it('should expose refreshUser method', () => {
      const mockRefreshUser = jest.fn();
      const mockValue = createMockContextValue({ refreshUser: mockRefreshUser });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current.refreshUser).toBe(mockRefreshUser);
      expect(typeof result.current.refreshUser).toBe('function');
    });
  });

  describe('context value structure', () => {
    it('should return all expected properties', () => {
      const mockValue = createMockContextValue();

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('register');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('refreshUser');
    });

    it('should have stable references', () => {
      const mockValue = createMockContextValue();

      const { result, rerender } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });
  });

  describe('authentication state combinations', () => {
    it('should handle authenticated user not loading', () => {
      const mockValue = createMockContextValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle unauthenticated user loading', () => {
      const mockValue = createMockContextValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
          <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
        ),
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(true);
    });
  });
});
