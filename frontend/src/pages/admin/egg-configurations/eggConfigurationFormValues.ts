import { z } from 'zod';
import {
  type AdminEggConfiguration,
  adminEggConfigurationSchema,
  adminEggConfigurationUpdateSchema,
} from '@/lib/schemas/admin/eggConfigurations.ts';

type EggConfigFormValues = z.infer<typeof adminEggConfigurationUpdateSchema>;

type EggConfigurationAllocations = NonNullable<AdminEggConfiguration['configAllocations']>;
type EggConfigurationPrimaryAllocation = NonNullable<EggConfigurationAllocations['deployment']['primary']>;
type EggConfigurationStartup = NonNullable<AdminEggConfiguration['configStartup']>;

export const eggConfigurationEmptyFormValues: EggConfigFormValues = {
  name: '',
  description: null,
  order: 0,
  eggs: [],
  configAllocations: null,
  configStartup: null,
  configRoutes: null,
};

export const defaultEggConfigurationPrimaryAllocation: EggConfigurationPrimaryAllocation = {
  startPort: 1,
  endPort: 65535,
  assignToVariable: null,
};

export const defaultEggConfigurationAllocations: EggConfigurationAllocations = {
  deployment: {
    additional: [],
    dedicated: false,
    primary: null,
  },
  userSelfAssign: {
    enabled: false,
    requirePrimaryAllocation: true,
    startPort: 1,
    endPort: 65535,
  },
};

export const defaultEggConfigurationStartup: EggConfigurationStartup = {
  allowCustomStartupCommand: false,
};

export const eggConfigurationToFormValues = (
  eggConfiguration: z.infer<typeof adminEggConfigurationSchema>,
): EggConfigFormValues => ({
  name: eggConfiguration.name,
  description: eggConfiguration.description,
  order: eggConfiguration.order,
  eggs: eggConfiguration.eggs,
  configAllocations: eggConfiguration.configAllocations,
  configStartup: eggConfiguration.configStartup,
  configRoutes: eggConfiguration.configRoutes,
});
