import { z } from 'zod';
import { adminNodeSchema, adminNodeUpdateSchema } from '@/lib/schemas/admin/nodes.ts';

type NodeFormValues = z.infer<typeof adminNodeUpdateSchema>;

export const nodeEmptyFormValues: NodeFormValues = {
  locationUuid: '',
  backupConfigurationUuid: null,
  name: '',
  deploymentEnabled: true,
  maintenanceEnabled: false,
  description: null,
  publicUrl: null,
  url: '',
  sftpHost: null,
  sftpPort: 2022,
  memory: 8192,
  disk: 10240,
};

export const nodeToFormValues = (node: z.infer<typeof adminNodeSchema>): Partial<NodeFormValues> => ({
  locationUuid: node.location.uuid,
  backupConfigurationUuid: node.backupConfiguration?.uuid ?? null,
  name: node.name,
  deploymentEnabled: node.deploymentEnabled,
  maintenanceEnabled: node.maintenanceEnabled,
  description: node.description,
  publicUrl: node.publicUrl,
  url: node.url,
  sftpHost: node.sftpHost,
  sftpPort: node.sftpPort,
  memory: node.memory,
  disk: node.disk,
});
