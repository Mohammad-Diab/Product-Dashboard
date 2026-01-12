import { apiServer } from '@/lib/api/server';
import { Product, ProductsResponse } from '../types';

export async function getProducts(cursor?: string | null, limit: number = 10): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (cursor) {
        params.append('cursor', cursor);
    }

    const response = await apiServer.get<ProductsResponse>(`/products?${params.toString()}`);
    return response;
}

export async function getProductById(id: string): Promise<Product> {
    const response = await apiServer.get<Product>(`/products/${id}`);
    return response;
}
