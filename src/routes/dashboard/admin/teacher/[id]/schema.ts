import { ZodType, z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  username: z.string().min(2).max(50),
  password: z.string().min(8),
  role: z.number().default(1),
  status: z.number().default(1)
});

export type FormSchema = typeof formSchema;
