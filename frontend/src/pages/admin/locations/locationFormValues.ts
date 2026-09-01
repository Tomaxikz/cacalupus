import { z } from 'zod';
import { adminLocationSchema, adminLocationUpdateSchema } from '@/lib/schemas/admin/locations.ts';

type LocationFormValues = z.infer<typeof adminLocationUpdateSchema>;

export const locationEmptyFormValues: LocationFormValues = {
  name: '',
  description: null,
  flag: null,
  backupConfigurationUuid: null,
};

export const locationToFormValues = (location: z.infer<typeof adminLocationSchema>): Partial<LocationFormValues> => ({
  name: location.name,
  description: location.description,
  flag: location.flag,
  backupConfigurationUuid: location.backupConfiguration?.uuid ?? null,
});
