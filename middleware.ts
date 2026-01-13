import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { isAuthRoute, isProtectedRoute, ROUTES } from '@/lib/routes';
import { env, serverEnv } from '@/config/env';

const AUTH_COOKIE_NAME = env.AUTH_COOKIE_NAME || 'auth-token';
const JWT_SECRET = new TextEncoder().encode(serverEnv.JWT_SECRET);

async function verifyToken(token: string): Promise<{ sub: string; role?: string } | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as { sub: string; role?: string };
    } catch {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    const payload = token ? await verifyToken(token) : null;
    const isAuthenticated = !!payload;

    if (isProtectedRoute(pathname)) {
        if (!isAuthenticated) {
            const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (pathname.startsWith('/orders') && payload) {
            const role = payload.role;
            if (role !== 'admin') {
                const unauthorizedUrl = new URL(ROUTES.PUBLIC.UNAUTHORIZED, request.url);
                return NextResponse.rewrite(unauthorizedUrl);
            }
        }
    }

    if (isAuthRoute(pathname)) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL(ROUTES.PROTECTED.DASHBOARD, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
};
