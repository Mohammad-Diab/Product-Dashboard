import { getOrders } from '@/features/orders/api';
import { OrderList } from '@/features/orders/components';
import { ORDERS_PAGE_SIZE } from '@/features/orders/constants';
import { PageHeader } from '@/components';

export default async function OrdersPage() {
  const { items, nextCursor, hasMore } = await getOrders(null, ORDERS_PAGE_SIZE);

  return (
    <div>
      <PageHeader title="Orders" />

      <OrderList
        initialOrders={items}
        initialNextCursor={nextCursor}
        initialHasMore={hasMore}
      />
    </div>
  );
}
