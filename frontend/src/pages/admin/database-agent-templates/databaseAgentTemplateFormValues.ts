import { z } from 'zod';
import {
  adminDatabaseAgentTemplateCreateSchema,
  adminDatabaseAgentTemplateSchema,
  adminDatabaseAgentTemplateUpdateSchema,
} from '@/lib/schemas/admin/databaseAgentTemplates.ts';

export type DatabaseAgentTemplateFormValues = z.infer<typeof adminDatabaseAgentTemplateUpdateSchema> &
  Partial<Pick<z.infer<typeof adminDatabaseAgentTemplateCreateSchema>, 'type'>>;

export const databaseAgentTemplateEmptyFormValues: DatabaseAgentTemplateFormValues = {
  name: '',
  description: null,
  type: 'postgres',
  deploymentEnabled: true,
  dockerImages: {},
  env: {},
  imageUid: 0,
  imageGid: 0,
  cmd: [],
  volumes: {},
  socketPath: '',
  memory: 0,
  swap: 0,
  disk: 0,
  ioWeight: null,
  cpu: 0,
};

export const databaseAgentTemplateToFormValues = (
  template: z.infer<typeof adminDatabaseAgentTemplateSchema>,
): DatabaseAgentTemplateFormValues => ({
  name: template.name,
  description: template.description,
  type: template.type,
  deploymentEnabled: template.deploymentEnabled,
  dockerImages: template.dockerImages,
  env: template.env,
  imageUid: template.imageUid,
  imageGid: template.imageGid,
  cmd: template.cmd ?? [],
  volumes: template.volumes,
  socketPath: template.socketPath,
  memory: template.memory,
  swap: template.swap,
  disk: template.disk,
  ioWeight: template.ioWeight,
  cpu: template.cpu,
});
