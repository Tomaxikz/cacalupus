import { z } from 'zod';
import { adminServerSchema, adminServerUpdateSchema } from '@/lib/schemas/admin/servers.ts';

type ServerUpdateFormValues = z.infer<typeof adminServerUpdateSchema>;

export const serverUpdateEmptyFormValues: ServerUpdateFormValues = {
  ownerUuid: '',
  eggUuid: '',
  backupConfigurationUuid: null,
  externalId: null,
  name: '',
  description: null,
  limits: {
    cpu: 100,
    memory: 1024,
    memoryOverhead: 0,
    swap: 0,
    disk: 10240,
    ioWeight: null,
  },
  pinnedCpus: [],
  startup: '',
  image: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  hugepagesPassthroughEnabled: false,
  kvmPassthroughEnabled: false,
  featureLimits: {
    allocations: 5,
    databases: 5,
    backups: 5,
    schedules: 5,
  },
};

export const serverToFormValues = (server: z.infer<typeof adminServerSchema>): Partial<ServerUpdateFormValues> => ({
  ownerUuid: server.owner.uuid,
  eggUuid: server.egg.uuid,
  backupConfigurationUuid: server.backupConfiguration?.uuid ?? null,
  externalId: server.externalId,
  name: server.name,
  description: server.description,
  limits: server.limits,
  pinnedCpus: server.pinnedCpus,
  startup: server.startup,
  image: server.image,
  timezone: server.timezone,
  hugepagesPassthroughEnabled: server.hugepagesPassthroughEnabled,
  kvmPassthroughEnabled: server.kvmPassthroughEnabled,
  featureLimits: server.featureLimits,
});
