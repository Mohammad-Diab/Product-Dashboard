import { SignJWT, jwtVerify } from 'jose';
import { env } from '@/config/env';

export type AuthJWTPayload = {
  sub: string;
  email: string;
};

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

const ALG = 'HS256';

const EXPIRATION_TIME = '7d';

export async function signJWT(payload: AuthJWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(EXPIRATION_TIME)
    .sign(JWT_SECRET);
}

export async function verifyJWT<T = AuthJWTPayload>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as T;
  } catch (error) {
    return null;
  }
}
