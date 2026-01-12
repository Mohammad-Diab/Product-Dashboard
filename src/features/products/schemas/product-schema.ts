import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
    price: z.number().positive('Price must be a positive number'),
    status: z.enum(['active', 'inactive'], {
        message: 'Status is required',
    }),
});

export type ProductFormData = z.infer<typeof productSchema>;
