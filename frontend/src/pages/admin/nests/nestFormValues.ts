import { z } from 'zod';
import { adminNestSchema, adminNestUpdateSchema } from '@/lib/schemas/admin/nests.ts';

type NestFormValues = z.infer<typeof adminNestUpdateSchema>;

export const nestEmptyFormValues: NestFormValues = {
  author: '',
  name: '',
  description: null,
};

export const nestToFormValues = (nest: z.infer<typeof adminNestSchema>): Partial<NestFormValues> => ({
  author: nest.author,
  name: nest.name,
  description: nest.description,
});
