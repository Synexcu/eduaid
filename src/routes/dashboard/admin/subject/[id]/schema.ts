import { z } from 'zod';

export const formSchema = z
  .object({
    id: z.string(),
    subjectName: z.string().min(2).max(50),
    phase: z.number().gt(0),
    minimum: z.coerce.number().gte(0).lte(100),
    medium: z.coerce.number().gte(0).lte(100)
  })
  .refine((data) => data.minimum < data.medium, {
    message: 'This number must be less than medium number',
    path: ['minimum']
  })
  .refine((data) => data.medium > data.minimum, {
    message: 'This number must be greater than minimum number',
    path: ['medium']
  });

export type FormSchema = typeof formSchema;
