import { z } from 'zod';
import {
  adminDatabaseCredentialsUpdateSchema,
  adminDatabaseHostSchema,
  adminDatabaseHostUpdateSchema,
} from '@/lib/schemas/admin/databaseHosts.ts';

type DatabaseHostFormValues = z.infer<typeof adminDatabaseHostUpdateSchema>;

export type AdminDatabaseCredentialType = z.infer<typeof adminDatabaseCredentialsUpdateSchema>['type'];

export const adminDatabaseCredentialsDefaults: Record<
  AdminDatabaseCredentialType,
  z.infer<typeof adminDatabaseCredentialsUpdateSchema>
> = {
  connection_string: { type: 'connection_string', connectionString: '' },
  details: { type: 'details', username: '', password: '', host: '', port: 3306 },
};

export const databaseHostEmptyFormValues: DatabaseHostFormValues = {
  name: '',
  type: 'mysql',
  deploymentEnabled: true,
  maintenanceEnabled: false,
  publicHost: null,
  publicPort: null,
  credentials: undefined,
};

export const databaseHostToFormValues = (
  databaseHost: z.infer<typeof adminDatabaseHostSchema>,
): Partial<DatabaseHostFormValues> => ({
  name: databaseHost.name,
  type: databaseHost.type,
  deploymentEnabled: databaseHost.deploymentEnabled,
  maintenanceEnabled: databaseHost.maintenanceEnabled,
  publicHost: databaseHost.publicHost,
  publicPort: databaseHost.publicPort,
  credentials: undefined,
});
