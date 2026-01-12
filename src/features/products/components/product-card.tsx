import Link from 'next/link';
import { Product } from '../types';
import { formatCurrency, formatDate } from '@/lib/formatters';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const isActive = product.status === 'active';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {product.status}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{product.description || 'No description'}</p>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
          <p className="text-sm text-gray-500 mt-1">Created {formatDate(product.createdAt)}</p>
        </div>

        <Link
          href={`/products/${product.id}/edit`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
