import { apiServer } from '@/lib/api/server';
import { Order, OrdersResponse } from '../types';

export async function getOrders(cursor?: string | null, limit: number = 10): Promise<OrdersResponse> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (cursor) {
        params.append('cursor', cursor);
    }

    const response = await apiServer.get<OrdersResponse>(`/orders?${params.toString()}`);
    return response;
}

export async function getOrderById(id: string): Promise<Order> {
    const response = await apiServer.get<Order>(`/orders/${id}`);
    return response;
}
