import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { isAuthRoute, isProtectedRoute, ROUTES } from '@/lib/routes';
import { env, serverEnv } from '@/config/env';

const AUTH_COOKIE_NAME = env.AUTH_COOKIE_NAME || 'auth-token';
const JWT_SECRET = new TextEncoder().encode(serverEnv.JWT_SECRET);

async function verifyToken(token: string): Promise<boolean> {
    try {
        await jwtVerify(token, JWT_SECRET);
        return true;
    } catch {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    const isAuthenticated = token ? await verifyToken(token) : false;

    if (isProtectedRoute(pathname)) {
        if (!isAuthenticated) {
            const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
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
