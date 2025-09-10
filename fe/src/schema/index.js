import * as z from 'zod';

export const ContactFormSchema = z
  .object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    position: z.string().min(1, 'Position is required'),
    contact_type: z.string().min(1, 'Contact type is required'),
    address: z.string().optional(),
  })
  .passthrough();

// Login form schema
export const LoginFormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

// Register form schema (based on Rust DTO)
export const RegisterFormSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters long'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});
