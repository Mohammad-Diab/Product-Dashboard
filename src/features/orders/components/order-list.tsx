'use client';

import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Order } from '../types';
import { OrderCard } from './order-card';
import { fetchOrders } from '../api/client';
import { ORDERS_PAGE_SIZE } from '../constants';
import { LoadingSpinner } from '@/components';

type OrderListProps = {
    initialOrders: Order[];
    initialNextCursor: string | null;
    initialHasMore: boolean;
};

export function OrderList({ initialOrders, initialNextCursor, initialHasMore }: OrderListProps) {
    const observerTarget = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['orders'],
        queryFn: ({ pageParam }: { pageParam: string | null }) => fetchOrders(pageParam, ORDERS_PAGE_SIZE),
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined;
        },
        initialData: {
            pages: [{ items: initialOrders, nextCursor: initialNextCursor, hasMore: initialHasMore }],
            pageParams: [null],
        },
        initialPageParam: null,
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
            observer.disconnect();
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allOrders = data?.pages.flatMap((page) => page.items) ?? [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (allOrders.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No orders found</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>

            {hasNextPage && (
                <div ref={observerTarget} className="flex justify-center items-center py-8">
                    {isFetchingNextPage && <LoadingSpinner />}
                </div>
            )}
        </div>
    );
}
