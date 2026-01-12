import { apiServer } from '@/lib/api/server';

export type DashboardStats = {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await apiServer.get<DashboardStats>('/dashboard/stats');
    return response;
}
