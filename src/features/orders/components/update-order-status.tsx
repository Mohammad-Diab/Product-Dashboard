'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateOrderStatus } from '../hooks';
import { updateOrderStatusSchema, type UpdateOrderStatusInput } from '../schemas';
import { OrderStatus } from '../types';
import { ORDER_STATUS_LABELS } from '../constants';
import { Button, FormField, Select, ErrorMessage } from '@/components';
import { getErrorMessage } from '@/lib/get-error-message';

type UpdateOrderStatusProps = {
    orderId: string;
    currentStatus: OrderStatus;
    onSuccess?: () => void;
};

const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'pending', label: ORDER_STATUS_LABELS.pending },
    { value: 'confirmed', label: ORDER_STATUS_LABELS.confirmed },
    { value: 'shipped', label: ORDER_STATUS_LABELS.shipped },
    { value: 'delivered', label: ORDER_STATUS_LABELS.delivered },
    { value: 'cancelled', label: ORDER_STATUS_LABELS.cancelled },
];

export function UpdateOrderStatus({ orderId, currentStatus, onSuccess }: UpdateOrderStatusProps) {
    const [error, setError] = useState<string | null>(null);
    const { mutate, isPending } = useUpdateOrderStatus();
    const isDelivered = currentStatus === 'delivered';
    const isCancelled = currentStatus === 'cancelled';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateOrderStatusInput>({
        resolver: zodResolver(updateOrderStatusSchema),
        defaultValues: {
            status: currentStatus,
        },
    });

    const onSubmit = (data: UpdateOrderStatusInput) => {
        if (isDelivered || isCancelled) return;

        setError(null);
        mutate(
            { id: orderId, data },
            {
                onSuccess: () => {
                    onSuccess?.();
                },
                onError: (err) => {
                    setError(getErrorMessage(err));
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && <ErrorMessage message={error} />}
            {(isDelivered || isCancelled) && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md">
                    {isDelivered ? "Delivered" : "Cancelled"} orders cannot be updated.
                </div>
            )}

            <FormField label="Order Status" error={errors.status?.message} required>
                <Select {...register('status')} disabled={isDelivered || isCancelled || isPending}>
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            </FormField>

            <div className="flex justify-end gap-3">
                <Button
                    variant="secondary"
                    size="md"
                    onClick={onSuccess}
                    disabled={isPending}
                    type="button"
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending || isDelivered || isCancelled}>
                    {isPending ? 'Updating...' : 'Update Status'}
                </Button>
            </div>
        </form>
    );
}
