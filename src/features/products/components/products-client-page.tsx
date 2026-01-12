'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components';
import { ProductList } from './product-list';
import { Product } from '../types';
import { useRole } from '@/features/auth';

type ProductsClientPageProps = {
  initialProducts: Product[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
};

export function ProductsClientPage({
  initialProducts,
  initialNextCursor,
  initialHasMore,
}: ProductsClientPageProps) {
  const { isAdmin } = useRole();
  const [showAll, setShowAll] = useState(true);

  return (
    <div>
      <PageHeader
        title="Products"
        actions={
          <div className="flex items-center gap-4">
            {isAdmin && (
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                Show All Products
              </label>
            )}
            <Link
              href="/products/new"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Create Product
            </Link>
          </div>
        }
      />

      <ProductList
        initialProducts={initialProducts}
        initialNextCursor={initialNextCursor}
        initialHasMore={initialHasMore}
        showAll={showAll}
      />
    </div>
  );
}
