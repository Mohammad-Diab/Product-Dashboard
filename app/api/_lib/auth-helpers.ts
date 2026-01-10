import { NextResponse } from 'next/server';
import { verifyJWT } from './jwt';
import type { ApiResponse } from '@/lib/api/types';
import type { JWTPayload } from 'jose';
import { getAuthToken } from './cookies';

export async function authenticateRequest(): Promise<
  | { authenticated: false; response: NextResponse<ApiResponse<never>> }
  | { authenticated: true; payload: JWTPayload }
> {
  const token = await getAuthToken();
  const payload = token ? await verifyJWT(token) : null;

  if (!payload) {
    return {
      authenticated: false,
      response: NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            message: 'Unauthorized',
            statusCode: 401,
            code: 'UNAUTHORIZED',
          },
        },
        { status: 401 }
      ),
    };
  }

  return {
    authenticated: true,
    payload,
  };
}
