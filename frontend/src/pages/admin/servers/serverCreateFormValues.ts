import { z } from 'zod';
import { adminServerCreateSchema } from '@/lib/schemas/admin/servers.ts';

type ServerCreateFormValues = z.infer<typeof adminServerCreateSchema>;

export const serverCreateEmptyFormValues: ServerCreateFormValues = {
  externalId: null,
  name: '',
  description: null,
  startOnCompletion: true,
  skipInstaller: false,
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
  nodeUuid: '',
  ownerUuid: '',
  eggUuid: '',
  backupConfigurationUuid: null,
  allocationUuid: null,
  allocationUuids: [],
  variables: [],
};
