import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  createdAt: z.iso.datetime(),
});

export const UsersSchema = z.array(UserSchema);

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  status: z.enum(['active', 'inactive']),
  createdAt: z.iso.datetime(),
});

export const ProductsSchema = z.array(ProductSchema);

export const OrderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
});

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  customerId: z.string(),
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
  totalAmount: z.number(),
  currency: z.string(),
  items: z.array(OrderItemSchema),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const OrdersSchema = z.array(OrderSchema);

// Validation Schemas
export const LoginRequestSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const RegisterRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const CreateProductRequestSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional().default(''),
  price: z.number().positive('Price must be a positive number'),
  status: z.enum(['active', 'inactive'], { message: 'Status must be either active or inactive' }),
});

export const UpdateProductRequestSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').optional(),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
  price: z.number().positive('Price must be a positive number').optional(),
  status: z.enum(['active', 'inactive'], { message: 'Status must be either active or inactive' }).optional(),
});

export const UpdateOrderRequestSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], { 
    message: 'Status must be pending, confirmed, shipped, delivered, or cancelled' 
  }),
});

export type User = z.infer<typeof UserSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type CreateProductRequest = z.infer<typeof CreateProductRequestSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductRequestSchema>;
export type UpdateOrderRequest = z.infer<typeof UpdateOrderRequestSchema>;
