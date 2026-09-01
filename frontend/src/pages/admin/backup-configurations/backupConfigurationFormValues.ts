import { z } from 'zod';
import {
  adminBackupConfigurationKopiaSchema,
  adminBackupConfigurationPbsSchema,
  adminBackupConfigurationResticSchema,
  adminBackupConfigurationS3Schema,
  adminBackupConfigurationSchema,
  adminBackupConfigurationUpdateSchema,
} from '@/lib/schemas/admin/backupConfigurations.ts';

type BackupConfigFormValues = Partial<z.infer<typeof adminBackupConfigurationUpdateSchema>>;

export const backupConfigurationEmptyFormValues: BackupConfigFormValues = {
  name: '',
  description: null,
  maintenanceEnabled: false,
  shared: false,
  backupDisk: 'local',
};

export const backupConfigurationS3EmptyFormValues: z.infer<typeof adminBackupConfigurationS3Schema> = {
  accessKey: '',
  secretKey: '',
  bucket: '',
  region: '',
  endpoint: '',
  compressionType: 'zstd',
  partSize: 1024 * 1024 * 1024,
  pathStyle: true,
};

export const backupConfigurationResticEmptyFormValues: z.infer<typeof adminBackupConfigurationResticSchema> = {
  repository: '',
  retryLockSeconds: 0,
  environment: {},
  pruneJobs: [],
};

export const backupConfigurationPbsEmptyFormValues: z.infer<typeof adminBackupConfigurationPbsSchema> = {
  url: '',
  datastore: '',
  namespace: '',
  tokenId: '',
  tokenSecret: '',
  fingerprint: '',
  backupIdPrefix: '',
};

export const backupConfigurationKopiaEmptyFormValues: z.infer<typeof adminBackupConfigurationKopiaSchema> = {
  url: '',
  username: '',
  password: '',
  fingerprint: '',
  tags: {},
};

export const backupConfigurationToFormValues = (
  backupConfiguration: z.infer<typeof adminBackupConfigurationSchema>,
): BackupConfigFormValues => ({
  name: backupConfiguration.name,
  description: backupConfiguration.description,
  maintenanceEnabled: backupConfiguration.maintenanceEnabled,
  shared: backupConfiguration.shared,
  backupDisk: backupConfiguration.backupDisk,
});
