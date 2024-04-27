import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  tpId: z.string().min(1, { message: 'Tujuan Pembelajaran must be selected' }),
  nilai: z.coerce.number().min(0).max(100)
});

export type FormSchema = typeof formSchema;
