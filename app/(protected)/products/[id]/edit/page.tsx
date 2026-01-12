import { notFound } from 'next/navigation';
import { getProductById } from '@/features/products/api';
import { EditProduct } from '@/features/products/components';
import { PageHeader } from '@/components';

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  try {
    const product = await getProductById(id);

    return (
      <div className="container mx-auto py-8 px-4">
        <PageHeader
          title="Edit Product"
          description="Update product information"
        />

        <EditProduct product={product} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
