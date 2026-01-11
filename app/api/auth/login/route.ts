import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  readJsonFile,
  setAuthToken,
  signJWT,
  UsersSchema,
  LoginRequestSchema,
  formatZodError,
  type User,
} from '../../_lib';
import type { ApiResponse } from '@/lib/api/types';

type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { body } = await request.json();

    const validation = LoginRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: formatZodError(validation.error),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const users = await readJsonFile<User>('users.json', UsersSchema);
    const user = users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            message: 'Invalid credentials',
            statusCode: 401,
            code: 'INVALID_CREDENTIALS',
          },
        },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            message: 'Invalid credentials',
            statusCode: 401,
            code: 'INVALID_CREDENTIALS',
          },
        },
        { status: 401 }
      );
    }

    const token = await signJWT({ sub: user.id, email: user.email });

    await setAuthToken(token);

    const response: LoginResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    return NextResponse.json<ApiResponse<LoginResponse>>(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
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
