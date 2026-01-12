'use client';

import { apiClient } from '@/lib/api/client';
import { ProductsResponse, Product, CreateProductInput, UpdateProductInput } from '../types';

export async function fetchProducts(cursor?: string | null, limit: number = 10, showAll: boolean = false): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (cursor) {
        params.append('cursor', cursor);
    }
    if (showAll) {
        params.append('showAll', 'true');
    }

    return apiClient.get<ProductsResponse>(`/products?${params.toString()}`);
}

export async function fetchProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
}

export async function createProduct(data: CreateProductInput): Promise<Product> {
    return apiClient.post<Product>('/products', data);
}

export async function updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, data);
}

export async function deleteProduct(id: string): Promise<void> {
    return apiClient.delete<void>(`/products/${id}`);
}
