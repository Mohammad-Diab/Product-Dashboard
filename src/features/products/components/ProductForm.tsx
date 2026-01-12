'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '../schemas';
import { Button, Input, Textarea, Select, FormField, ErrorMessage } from '@/components';
import { Product } from '../types';

type ProductFormProps = {
    initialData?: Product;
    onSubmit: (data: ProductFormData) => void;
    isSubmitting: boolean;
    serverError?: string;
};

export function ProductForm({ initialData, onSubmit, isSubmitting, serverError }: ProductFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                description: initialData.description || '',
                price: initialData.price,
                status: initialData.status,
            }
            : {
                name: '',
                description: '',
                price: 0,
                status: 'active',
            },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
            <ErrorMessage message={serverError} />

            <FormField
                label="Name"
                htmlFor="name"
                error={errors.name?.message}
                required
            >
                <Input
                    id="name"
                    type="text"
                    error={errors.name?.message}
                    {...register('name')}
                />
            </FormField>

            <FormField
                label="Description"
                htmlFor="description"
                error={errors.description?.message}
            >
                <Textarea
                    id="description"
                    rows={4}
                    error={errors.description?.message}
                    {...register('description')}
                />
            </FormField>

            <FormField
                label="Price"
                htmlFor="price"
                error={errors.price?.message}
                required
            >
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    error={errors.price?.message}
                    {...register('price', { valueAsNumber: true })}
                />
            </FormField>

            <FormField
                label="Status"
                htmlFor="status"
                error={errors.status?.message}
                required
            >
                <Select
                    id="status"
                    error={errors.status?.message}
                    {...register('status')}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </Select>
            </FormField>

            <div className="flex gap-4">
                <Button type="submit" isLoading={isSubmitting}>
                    {initialData ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}
