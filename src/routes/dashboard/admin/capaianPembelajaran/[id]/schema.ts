import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  subjectId: z.string().min(1, { message: 'Pelajaran must not be empty' }).nullable(),
  capaianPembelajaran: z.string().min(2)
});

export type FormSchema = typeof formSchema;
