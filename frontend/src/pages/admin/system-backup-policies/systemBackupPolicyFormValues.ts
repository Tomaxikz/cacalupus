import { z } from 'zod';
import {
  adminSystemBackupPolicySchema,
  adminSystemBackupPolicyUpdateSchema,
} from '@/lib/schemas/admin/systemBackupPolicies.ts';

type SystemBackupPolicyFormValues = z.infer<typeof adminSystemBackupPolicyUpdateSchema>;

export const systemBackupPolicyEmptyFormValues: SystemBackupPolicyFormValues = {
  name: '',
  description: null,
  backupConfigurationUuid: null,
  enabled: true,
  cron: '0 0 0 * * *',
  retentionCount: null,
  retentionDays: null,
  parallelism: 2,
};

export const systemBackupPolicyToFormValues = (
  policy: z.infer<typeof adminSystemBackupPolicySchema>,
): Partial<SystemBackupPolicyFormValues> => ({
  name: policy.name,
  description: policy.description,
  backupConfigurationUuid: policy.backupConfiguration?.uuid ?? null,
  enabled: policy.enabled,
  cron: policy.cron,
  retentionCount: policy.retentionCount,
  retentionDays: policy.retentionDays,
  parallelism: policy.parallelism,
});
