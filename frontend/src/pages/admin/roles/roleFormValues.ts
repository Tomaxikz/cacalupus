import { z } from 'zod';
import { adminRoleUpdateSchema } from '@/lib/schemas/admin/roles.ts';
import { roleSchema } from '@/lib/schemas/user.ts';

type RoleFormValues = z.infer<typeof adminRoleUpdateSchema>;

export const roleEmptyFormValues: RoleFormValues = {
  name: '',
  description: null,
  requireTwoFactor: false,
  adminPermissions: [],
  serverPermissions: [],
};

export const roleToFormValues = (role: z.infer<typeof roleSchema>): Partial<RoleFormValues> => ({
  name: role.name,
  description: role.description,
  adminPermissions: role.adminPermissions,
  serverPermissions: role.serverPermissions,
});
