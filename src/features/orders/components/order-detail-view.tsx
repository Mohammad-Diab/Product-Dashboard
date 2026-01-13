'use client';

import { useState } from 'react';
import { Order } from '../types';
import { UpdateOrderStatus } from './update-order-status';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../constants';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import { Modal } from '@/components';

type OrderDetailViewProps = {
    order: Order;
};

export function OrderDetailView({ order: initialOrder }: OrderDetailViewProps) {
    const [order, setOrder] = useState(initialOrder);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const statusColor = ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800';
    const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
    const isDelivered = order.status === 'delivered';
    const isCancelled = order.status === 'cancelled';

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex gap-6 mb-8">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Order Number</p>
                                <p className="font-medium text-gray-900">{order.orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Customer ID</p>
                                <p className="font-medium text-gray-900">{order.customerId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                                    {statusLabel}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dates</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Created At</p>
                                <p className="font-medium text-gray-900">{formatDateTime(order.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Last Updated</p>
                                <p className="font-medium text-gray-900">{formatDateTime(order.updatedAt)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start justify-end">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            disabled={isDelivered || isCancelled}
                            className="w-[150px] px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                        >
                            Update Status
                        </button>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unit Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {order.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.productName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(item.unitPrice)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatCurrency(item.quantity * item.unitPrice)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                        Total:
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        {formatCurrency(order.totalAmount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Update Order Status"
            >
                <UpdateOrderStatus
                    orderId={order.id}
                    currentStatus={order.status}
                    onSuccess={(updatedOrder) => {
                        setOrder(updatedOrder);
                        setIsModalOpen(false);
                    }}
                    onCancel={() => {
                        setIsModalOpen(false);
                    }}
                />
            </Modal>
        </>
    );
}
