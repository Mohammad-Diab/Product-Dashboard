import { NextRequest, NextResponse } from 'next/server';
import {
    readJsonFile,
    writeJsonFile,
    authenticateRequest,
    ProductsSchema,
    UpdateProductRequestSchema,
    formatZodError,
    type Product,
    type UpdateProductRequest,
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
        const products = await readJsonFile<Product>('products.json', ProductsSchema);
        const product = products.find((p) => p.id === id);

        if (!product) {
            return NextResponse.json<ApiResponse<never>>(
                {
                    success: false,
                    error: {
                        message: 'Product not found',
                        statusCode: 404,
                        code: 'NOT_FOUND',
                    },
                },
                { status: 404 }
            );
        }

        return NextResponse.json<ApiResponse<Product>>(
            {
                success: true,
                data: product,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get product error:', error);
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

        const validation = UpdateProductRequestSchema.safeParse(body);
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

        const products = await readJsonFile<Product>('products.json', ProductsSchema);
        const productIndex = products.findIndex((p) => p.id === id);

        if (productIndex === -1) {
            return NextResponse.json<ApiResponse<never>>(
                {
                    success: false,
                    error: {
                        message: 'Product not found',
                        statusCode: 404,
                        code: 'NOT_FOUND',
                    },
                },
                { status: 404 }
            );
        }

        const updatedProduct: Product = {
            ...products[productIndex],
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(price !== undefined && { price }),
            ...(status !== undefined && { status }),
        };

        products[productIndex] = updatedProduct;
        await writeJsonFile('products.json', products, ProductsSchema);

        return NextResponse.json<ApiResponse<Product>>(
            {
                success: true,
                data: updatedProduct,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update product error:', error);
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

export async function DELETE(
    request: NextRequest,
    context: RouteContext
): Promise<NextResponse> {
    try {
        const auth = await authenticateRequest();
        if (!auth.authenticated) {
            return auth.response;
        }

        const { id } = await context.params;
        const products = await readJsonFile<Product>('products.json', ProductsSchema);
        const productIndex = products.findIndex((p) => p.id === id);

        if (productIndex === -1) {
            return NextResponse.json<ApiResponse<never>>(
                {
                    success: false,
                    error: {
                        message: 'Product not found',
                        statusCode: 404,
                        code: 'NOT_FOUND',
                    },
                },
                { status: 404 }
            );
        }

        products.splice(productIndex, 1);
        await writeJsonFile('products.json', products, ProductsSchema);

        return NextResponse.json<ApiResponse<{ message: string }>>(
            {
                success: true,
                data: { message: 'Product deleted successfully' },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete product error:', error);
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
