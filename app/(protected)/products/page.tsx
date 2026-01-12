import Link from 'next/link';
import { getProducts } from '@/features/products/api';
import { ProductList } from '@/features/products/components';
import { PRODUCTS_PAGE_SIZE } from '@/features/products/constants';
import { PageHeader } from '@/components';

export default async function ProductsPage() {
  const { items, nextCursor, hasMore } = await getProducts(null, PRODUCTS_PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Products"
        actions={
          <Link
            href="/products/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Create Product
          </Link>
        }
      />

      <ProductList
        initialProducts={items}
        initialNextCursor={nextCursor}
        initialHasMore={hasMore}
      />
    </div>
  );
}
