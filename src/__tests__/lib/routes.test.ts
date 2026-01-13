import { isAuthRoute, isProtectedRoute, ROUTES } from '@/lib/routes';

describe('routes', () => {
  describe('isAuthRoute', () => {
    it('should return true for login route', () => {
      expect(isAuthRoute('/login')).toBe(true);
    });

    it('should return true for register route', () => {
      expect(isAuthRoute('/register')).toBe(true);
    });

    it('should return false for protected routes', () => {
      expect(isAuthRoute('/dashboard')).toBe(false);
      expect(isAuthRoute('/products')).toBe(false);
    });

    it('should return false for home route', () => {
      expect(isAuthRoute('/')).toBe(false);
    });
  });

  describe('isProtectedRoute', () => {
    it('should return true for dashboard route', () => {
      expect(isProtectedRoute('/dashboard')).toBe(true);
    });

    it('should return true for products routes', () => {
      expect(isProtectedRoute('/products')).toBe(true);
      expect(isProtectedRoute('/products/123')).toBe(true);
      expect(isProtectedRoute('/products/new')).toBe(true);
    });

    it('should return true for orders routes', () => {
      expect(isProtectedRoute('/orders')).toBe(true);
      expect(isProtectedRoute('/orders/123')).toBe(true);
    });

    it('should return false for auth routes', () => {
      expect(isProtectedRoute('/login')).toBe(false);
      expect(isProtectedRoute('/register')).toBe(false);
    });

    it('should return true for home route', () => {
      expect(isProtectedRoute('/')).toBe(true);
    });
  });

  describe('ROUTES constants', () => {
    it('should have correct auth routes', () => {
      expect(ROUTES.AUTH.LOGIN).toBe('/login');
      expect(ROUTES.AUTH.REGISTER).toBe('/register');
    });

    it('should have correct protected routes', () => {
      expect(ROUTES.PROTECTED.DASHBOARD).toBe('/');
      expect(ROUTES.PROTECTED.PRODUCTS).toBe('/products');
      expect(ROUTES.PROTECTED.ORDERS).toBe('/orders');
    });

    it('should have correct public routes', () => {
      expect(ROUTES.PUBLIC.HOME).toBe('/');
    });
  });
});
