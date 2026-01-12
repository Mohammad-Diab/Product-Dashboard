'use client';

import Link from 'next/link';
import { Order } from '../types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../constants';

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  const statusColor = ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800';
  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{order.orderNumber}</h3>
          <p className="text-sm text-gray-500">Customer ID: {order.customerId}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mb-4 flex-1">
        <p className="text-sm text-gray-600 mb-2">
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </p>
        <div className="space-y-1">
          {order.items.slice(0, 2).map((item, index) => (
            <p key={index} className="text-sm text-gray-700 truncate">
              {item.quantity}x {item.productName}
            </p>
          ))}
          {order.items.length > 2 && (
            <p className="text-sm text-gray-500">+{order.items.length - 2} more</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
        <p className="text-sm text-gray-500 mt-1">Ordered {formatDate(order.createdAt)}</p>
      </div>

      <div className="flex gap-4 justify-center">
        <Link
          href={`/orders/${order.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center flex-1"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
