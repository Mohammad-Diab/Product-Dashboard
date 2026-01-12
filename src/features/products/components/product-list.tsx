'use client';

import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Product } from '../types';
import { ProductCard } from './product-card';
import { fetchProducts } from '../api/client';
import { PRODUCTS_PAGE_SIZE } from '../constants';
import { LoadingSpinner } from '@/components';

type ProductListProps = {
    initialProducts: Product[];
    initialNextCursor: string | null;
    initialHasMore: boolean;
    showAll?: boolean;
};

export function ProductList({ initialProducts, initialNextCursor, initialHasMore, showAll = false }: ProductListProps) {
    const observerTarget = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['products', showAll],
        queryFn: ({ pageParam }: { pageParam: string | null }) => fetchProducts(pageParam, PRODUCTS_PAGE_SIZE, showAll),
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined;
        },
        initialData: {
            pages: [{ items: initialProducts, nextCursor: initialNextCursor, hasMore: initialHasMore }],
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

    const allProducts = data?.pages.flatMap((page) => page.items) ?? [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (allProducts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
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
