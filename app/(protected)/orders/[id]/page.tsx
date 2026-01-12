import { getOrderById } from '@/features/orders/api';
import { OrderDetailView } from '@/features/orders/components';
import { PageHeader } from '@/components';

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  return (
    <div>
      <PageHeader title={`Order ${order.orderNumber}`} />
      <OrderDetailView order={order} />
    </div>
  );
}
