import { z } from 'zod';
import { databaseAgentTypeDefaultPortMapping, databaseAgentTypeLabelMapping } from '@/lib/enums.ts';
import {
  adminDatabaseAgentHostSchema,
  adminDatabaseAgentHostUpdateSchema,
} from '@/lib/schemas/admin/databaseAgentHosts.ts';

type DatabaseAgentHostFormValues = z.infer<typeof adminDatabaseAgentHostUpdateSchema>;
type DatabaseAgentTypeKey = keyof typeof databaseAgentTypeLabelMapping;

export const databaseAgentHostEmptyFormValues: DatabaseAgentHostFormValues = {
  name: '',
  description: null,
  deploymentEnabled: true,
  maintenanceEnabled: false,
  url: '',
  memory: 0,
  disk: 0,
  types: Object.fromEntries(
    (Object.keys(databaseAgentTypeLabelMapping) as DatabaseAgentTypeKey[]).map((type) => [
      type,
      { enabled: true, publicHost: null, publicPort: databaseAgentTypeDefaultPortMapping[type] },
    ]),
  ) as DatabaseAgentHostFormValues['types'],
};

export const databaseAgentHostToFormValues = (
  host: z.infer<typeof adminDatabaseAgentHostSchema>,
): Partial<DatabaseAgentHostFormValues> => ({
  name: host.name,
  description: host.description,
  deploymentEnabled: host.deploymentEnabled,
  maintenanceEnabled: host.maintenanceEnabled,
  url: host.url,
  memory: host.memory,
  disk: host.disk,
  types: host.types,
});
