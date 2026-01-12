import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], {
        required_error: 'Status is required',
        invalid_type_error: 'Invalid status value',
    }),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
