import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  tpId: z.string().nullable(),
  userId: z.string(),
  modul: z.string(),
});

export type FormSchema = typeof formSchema;
