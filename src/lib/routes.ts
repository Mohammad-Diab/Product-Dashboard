export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  PROTECTED: {
    DASHBOARD: '/dashboard',
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
  ROUTES.PROTECTED.PRODUCTS,
  ROUTES.PROTECTED.ORDERS,
];

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}
