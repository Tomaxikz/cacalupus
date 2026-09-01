import { z } from 'zod';
import { adminFullUserSchema, adminUserUpdateSchema } from '@/lib/schemas/admin/users.ts';

type UserFormValues = z.infer<typeof adminUserUpdateSchema>;

// `language` is filled in by the component from the app's configured language.
export const userEmptyFormValues: UserFormValues = {
  externalId: null,
  username: '',
  email: '',
  nameFirst: '',
  nameLast: '',
  password: null,
  admin: false,
  frozen: false,
  suspended: false,
  language: '',
  roleUuid: null,
};

export const userToFormValues = (user: z.infer<typeof adminFullUserSchema>): Partial<UserFormValues> => ({
  externalId: user.externalId,
  username: user.username,
  email: user.email,
  nameFirst: user.nameFirst,
  nameLast: user.nameLast,
  password: null,
  admin: user.admin,
  frozen: user.frozen,
  suspended: user.suspended,
  language: user.language,
  roleUuid: user.role?.uuid ?? null,
});
