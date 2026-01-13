import { NextRequest, NextResponse } from 'next/server';
import {
    readJsonFile,
    authenticateRequest,
    ProductsSchema,
    type Product,
} from '@/app/api/_lib';
import type { ApiResponse } from '@/lib/api/types';

type DashboardStatsResponse = {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const auth = await authenticateRequest();
        if (!auth.authenticated) {
            return auth.response;
        }

        const payload = auth.payload as { sub: string; email: string; role?: string };
        let products = await readJsonFile<Product>('products.json', ProductsSchema);

        // Filter products based on user role (same logic as GET /products)
        if (payload.role !== 'admin') {
            products = products.filter(p => p.createdBy === payload.sub);
        }

        const stats: DashboardStatsResponse = {
            totalProducts: products.length,
            activeProducts: products.filter(p => p.status === 'active').length,
            inactiveProducts: products.filter(p => p.status === 'inactive').length,
        };

        return NextResponse.json<ApiResponse<DashboardStatsResponse>>(
            {
                success: true,
                data: stats,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get dashboard stats error:', error);
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
