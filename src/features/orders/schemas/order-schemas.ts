import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], {
        error: 'Invalid status value',
    }),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
