import { NextRequest, NextResponse } from 'next/server';
import {
    readJsonFile,
    authenticateRequest,
    OrdersSchema,
    type Order,
} from '../_lib';
import type { ApiResponse } from '@/lib/api/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const auth = await authenticateRequest();
        if (!auth.authenticated) {
            return auth.response;
        }

        const orders = await readJsonFile<Order>('orders.json', OrdersSchema);

        const searchParams = request.nextUrl.searchParams;
        const cursor = searchParams.get('cursor');
        const limit = parseInt(searchParams.get('limit') || '10');

        let startIndex = 0;
        if (cursor) {
            const cursorIndex = orders.findIndex((o) => o.id === cursor);
            if (cursorIndex !== -1) {
                startIndex = cursorIndex + 1;
            }
        }

        const paginatedOrders = orders.slice(startIndex, startIndex + limit);
        const hasMore = paginatedOrders.length === limit && startIndex + limit < orders.length;
        const nextCursor = hasMore ? paginatedOrders[paginatedOrders.length - 1].id : null;

        return NextResponse.json<ApiResponse<{
            items: Order[];
            nextCursor: string | null;
            hasMore: boolean;
        }>>(
            {
                success: true,
                data: {
                    items: paginatedOrders,
                    nextCursor,
                    hasMore,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get orders error:', error);
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
