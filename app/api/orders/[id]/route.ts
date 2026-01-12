import { NextRequest, NextResponse } from 'next/server';
import {
    readJsonFile,
    writeJsonFile,
    authenticateRequest,
    OrdersSchema,
    UpdateOrderRequestSchema,
    formatZodError,
    type Order,
} from '../../_lib';
import type { ApiResponse } from '@/lib/api/types';

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    request: NextRequest,
    context: RouteContext
): Promise<NextResponse> {
    try {
        const auth = await authenticateRequest();
        if (!auth.authenticated) {
            return auth.response;
        }

        const { id } = await context.params;
        const orders = await readJsonFile<Order>('orders.json', OrdersSchema);
        const order = orders.find((o) => o.id === id);

        if (!order) {
            return NextResponse.json<ApiResponse<never>>(
                {
                    success: false,
                    error: {
                        message: 'Order not found',
                        statusCode: 404,
                        code: 'NOT_FOUND',
                    },
                },
                { status: 404 }
            );
        }

        return NextResponse.json<ApiResponse<Order>>(
            {
                success: true,
                data: order,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get order error:', error);
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

export async function PUT(
    request: NextRequest,
    context: RouteContext
): Promise<NextResponse> {
    try {
        const auth = await authenticateRequest();
        if (!auth.authenticated) {
            return auth.response;
        }

        const { id } = await context.params;
        const body = await request.json();

        const validation = UpdateOrderRequestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json<ApiResponse<never>>(
                {
                    success: false,
                    error: formatZodError(validation.error),
                },
                { status: 400 }
            );
        }

        const { status } = validation.data;

        const orders = await readJsonFile<Order>('orders.json', OrdersSchema);
        const orderIndex = orders.findIndex((o) => o.id === id);

        if (orderIndex === -1) {
            return NextResponse.json<ApiResponse<never>>(
                {
                    success: false,
                    error: {
                        message: 'Order not found',
                        statusCode: 404,
                        code: 'NOT_FOUND',
                    },
                },
                { status: 404 }
            );
        }

        const updatedOrder: Order = {
            ...orders[orderIndex],
            status,
            updatedAt: new Date().toISOString(),
        };

        orders[orderIndex] = updatedOrder;

        await writeJsonFile<Order>('orders.json', orders, OrdersSchema);

        return NextResponse.json<ApiResponse<Order>>(
            {
                success: true,
                data: updatedOrder,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update order error:', error);
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
