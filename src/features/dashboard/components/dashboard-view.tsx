"use client";

import Link from 'next/link';
import { PageHeader } from '@/components';
import { useAuth } from '@/features/auth';

type DashboardViewProps = {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
};

export function DashboardView({ totalProducts, activeProducts, inactiveProducts }: DashboardViewProps) {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Management"
        description="Welcome to your product management dashboard"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Total Products
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{totalProducts}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Active Products
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{activeProducts}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Inactive Products
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-600">{inactiveProducts}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="space-y-3">
          <p className="text-gray-600">
            • View and manage your products from the{' '}
            <Link href="/products" className="text-blue-600 hover:text-blue-800 font-medium underline">
              products page
            </Link>
          </p>
          <p className="text-gray-600">
            •{' '}
            <Link href="/products/new" className="text-blue-600 hover:text-blue-800 font-medium underline">
              Create new products
            </Link>
            {' '}to expand your catalog
          </p>
          <p className="text-gray-600">
            •{' '}
            <Link href="/products" className="text-blue-600 hover:text-blue-800 font-medium underline">
              Update product details and pricing
            </Link>
          </p>
          {user?.role === 'admin' && (
            <p className="text-gray-600">
              •{' '}
              <Link href="/orders" className="text-blue-600 hover:text-blue-800 font-medium underline">
                View and manage orders
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
