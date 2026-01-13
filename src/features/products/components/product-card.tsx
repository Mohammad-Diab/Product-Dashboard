'use client';

import Link from 'next/link';
import { Product } from '../types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { DeleteProductButton } from './delete-product-button';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const isActive = product.status === 'active';


  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
            }`}
        >
          {product.status}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{product.description || 'No description'}</p>

      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
        <p className="text-sm text-gray-500 mt-1">Created {formatDate(product.createdAt)}</p>
      </div>

      <div className="flex gap-4">
        <Link
          href={`/products/${product.id}/edit`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center flex-1"
        >
          Edit
        </Link>
        <DeleteProductButton productId={product.id} productName={product.name} />
      </div>
    </div>
  );
}
