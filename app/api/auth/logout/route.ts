import { NextRequest, NextResponse } from 'next/server';
import { clearAuthToken } from '@/app/api/_lib';
import type { ApiResponse } from '@/lib/api/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await clearAuthToken();

    return NextResponse.json<ApiResponse<{ message: string }>>(
      {
        success: true,
        data: { message: 'Logged out successfully' },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
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
