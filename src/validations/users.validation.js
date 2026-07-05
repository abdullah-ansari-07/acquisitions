import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['user', 'admin']).optional(),
});
