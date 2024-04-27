import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  classname: z.string().min(2).max(50),
  batch: z.coerce.number().gt(0)
});

export type FormSchema = typeof formSchema;
