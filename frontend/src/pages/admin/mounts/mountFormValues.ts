import { z } from 'zod';
import { adminMountSchema, adminMountUpdateSchema } from '@/lib/schemas/admin/mounts.ts';

export type MountFormValues = z.infer<typeof adminMountUpdateSchema>;

export const mountEmptyFormValues: MountFormValues = {
  name: '',
  description: null,
  source: '',
  target: '',
  readOnly: false,
  userMountable: false,
};

export const mountToFormValues = (mount: z.infer<typeof adminMountSchema>): MountFormValues => ({
  name: mount.name,
  description: mount.description,
  source: mount.source,
  target: mount.target,
  readOnly: mount.readOnly,
  userMountable: mount.userMountable,
});
