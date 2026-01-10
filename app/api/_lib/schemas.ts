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

export type User = z.infer<typeof UserSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type CreateProductRequest = z.infer<typeof CreateProductRequestSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductRequestSchema>;
