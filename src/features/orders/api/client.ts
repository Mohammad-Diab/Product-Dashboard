import { apiClient } from '@/lib/api/client';
import { Order, OrdersResponse, UpdateOrderInput } from '../types';

export async function fetchOrders(cursor?: string | null, limit: number = 10): Promise<OrdersResponse> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (cursor) {
        params.append('cursor', cursor);
    }

    const response = await apiClient.get<OrdersResponse>(`/orders?${params.toString()}`);
    return response;
}

export async function fetchOrderById(id: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response;
}

export async function updateOrderStatus(id: string, data: UpdateOrderInput): Promise<Order> {
    const response = await apiClient.put<Order>(`/orders/${id}`, data);
    return response;
}
