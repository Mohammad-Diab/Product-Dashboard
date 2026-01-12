import Link from 'next/link';
import { getProducts } from '@/features/products/api';
import { ProductList } from '@/features/products/components';
import { PRODUCTS_PAGE_SIZE } from '@/features/products/constants';

export default async function ProductsPage() {
  const { items, nextCursor, hasMore } = await getProducts(null, PRODUCTS_PAGE_SIZE);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link
          href="/products/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Create Product
        </Link>
      </div>

      <ProductList
        initialProducts={items}
        initialNextCursor={nextCursor}
        initialHasMore={hasMore}
      />
    </div>
  );
}
