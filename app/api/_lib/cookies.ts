import { cookies } from 'next/headers';
import { env } from '@/config/env';

const TOKEN_NAME = env.AUTH_COOKIE_NAME;
const ENVIRONMENT = env.NODE_ENV;
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: ENVIRONMENT === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });
}

export async function getAuthToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value;
}

export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}
