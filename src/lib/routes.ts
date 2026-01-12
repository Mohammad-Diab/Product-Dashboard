export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  PROTECTED: {
    DASHBOARD: '/',
    DASHBOARD_ALT: '/dashboard',
    PRODUCTS: '/products',
    ORDERS: '/orders',
  },
  PUBLIC: {
    HOME: '/',
  },
} as const;

export const AUTH_ROUTES = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER];

export const PROTECTED_ROUTES = [
  ROUTES.PROTECTED.DASHBOARD,
  ROUTES.PROTECTED.DASHBOARD_ALT,
  ROUTES.PROTECTED.PRODUCTS,
  ROUTES.PROTECTED.ORDERS,
];

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export function isProtectedRoute(pathname: string): boolean {
  // Root path and /dashboard are protected
  if (pathname === '/' || pathname === '/dashboard') return true;
  
  // Check other protected routes
  return [ROUTES.PROTECTED.PRODUCTS, ROUTES.PROTECTED.ORDERS].some((route) => 
    pathname.startsWith(route)
  );
}
