import { z } from 'zod';
import {
  adminEggRepositoryCredentialsSchema,
  adminEggRepositoryCredentialsUpdateSchema,
  adminEggRepositorySchema,
  adminEggRepositoryUpdateSchema,
} from '@/lib/schemas/admin/eggRepositories.ts';

type EggRepositoryFormValues = z.infer<typeof adminEggRepositoryUpdateSchema>;

export type AdminEggRepositoryCredentialType = z.infer<typeof adminEggRepositoryCredentialsUpdateSchema>['type'];

export const adminEggRepositoryCredentialsDefaults: Record<
  AdminEggRepositoryCredentialType,
  z.infer<typeof adminEggRepositoryCredentialsSchema>
> = {
  none: { type: 'none' },
  password: { type: 'password', username: '', password: '' },
  private_key: { type: 'private_key', username: 'git', privateKey: '', passphrase: null },
};

export const eggRepositoryEmptyFormValues: EggRepositoryFormValues = {
  name: '',
  description: null,
  gitRepository: '',
  credentials: undefined,
};

export const eggRepositoryToFormValues = (
  eggRepository: z.infer<typeof adminEggRepositorySchema>,
): Partial<EggRepositoryFormValues> => ({
  name: eggRepository.name,
  description: eggRepository.description,
  gitRepository: eggRepository.gitRepository,
  credentials: undefined,
});
