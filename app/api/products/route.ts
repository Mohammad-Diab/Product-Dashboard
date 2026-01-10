import { NextRequest, NextResponse } from 'next/server';
import {
    readJsonFile,
    addToJsonFile,
    authenticateRequest,
    ProductsSchema,
    CreateProductRequestSchema,
    formatZodError,
    type Product,
} from '../_lib';
import type { ApiResponse } from '@/lib/api/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const auth = await authenticateRequest();
        if (!auth.authenticated) {
            return auth.response;
        }

        const products = await readJsonFile<Product>('products.json', ProductsSchema);

        const searchParams = request.nextUrl.searchParams;
        const cursor = searchParams.get('cursor');
        const limit = parseInt(searchParams.get('limit') || '10');

        let startIndex = 0;
        if (cursor) {
            const cursorIndex = products.findIndex((p) => p.id === cursor);
            if (cursorIndex !== -1) {
                startIndex = cursorIndex + 1;
            }
        }

        const paginatedProducts = products.slice(startIndex, startIndex + limit);
        const hasMore = paginatedProducts.length === limit && startIndex + limit < products.length;
        const nextCursor = hasMore ? paginatedProducts[paginatedProducts.length - 1].id : null;

        return NextResponse.json<ApiResponse<{
            items: Product[];
            nextCursor: string | null;
            hasMore: boolean;
        }>>(
            {
                success: true,
                data: {
                    items: paginatedProducts,
                    nextCursor,
                    hasMore,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get products error:', error);
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

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const auth = await authenticateRequest();
        if (!auth.authenticated) {
            return auth.response;
        }

        const body = await request.json();

        const validation = CreateProductRequestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json<ApiResponse<never>>(
                {
                    success: false,
                    error: formatZodError(validation.error),
                },
                { status: 400 }
            );
        }

        const { name, description, price, status } = validation.data;

        const newProduct = await addToJsonFile<Product>('products.json', ProductsSchema, {
            name,
            description: description || '',
            price,
            status,
        });

        return NextResponse.json<ApiResponse<Product>>(
            {
                success: true,
                data: newProduct,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create product error:', error);
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
