import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, authenticateRequest, UsersSchema, type User } from '@/app/api/_lib';
import type { ApiResponse } from '@/lib/api/types';

type MeResponse = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = await authenticateRequest();
    if (!auth.authenticated) {
      return auth.response;
    }

    const payload = auth.payload as { sub: string; email: string };
    
    const users = await readJsonFile<User>('users.json', UsersSchema);
    const user = users.find(u => u.id === payload.sub);
    
    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            message: 'User not found',
            statusCode: 404,
            code: 'USER_NOT_FOUND',
          },
        },
        { status: 404 }
      );
    }

    const response: MeResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json<ApiResponse<MeResponse>>(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          message: 'Internal server error',
          statusCode: 500,
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
