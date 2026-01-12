'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader, ToggleButtonGroup } from '@/components';
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
  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      <PageHeader
        title="Products"
        actions={
          <div className="flex items-center gap-4">
            {isAdmin && (
              <ToggleButtonGroup
                options={[
                  { label: 'My Products', value: false },
                  { label: 'All Products', value: true },
                ]}
                value={showAll}
                onChange={(value) => setShowAll(value as boolean)}
                ariaLabel="Product view filter"
              />
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
