import { getProducts } from '@/features/products/api';
import { ProductsClientPage } from '@/features/products/components/products-client-page';
import { PRODUCTS_PAGE_SIZE } from '@/features/products/constants';

export default async function ProductsPage() {
  const { items, nextCursor, hasMore } = await getProducts(null, PRODUCTS_PAGE_SIZE);

  return (
    <ProductsClientPage
      initialProducts={items}
      initialNextCursor={nextCursor}
      initialHasMore={hasMore}
    />
  );
}
