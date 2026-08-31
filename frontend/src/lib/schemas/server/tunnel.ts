import { z } from 'zod';
import { networkProtocol } from '@/lib/schemas/generic.ts';

export const serverTunnelPortSchema = z.object({
  port: z.number().int().min(1).max(65535),
  protocols: z.array(networkProtocol).min(1),
  created: z.string(),
});

export const serverTunnelPeerSchema = z.object({
  serverUuid: z.string(),
  serverName: z.string(),
  name: z.string(),
  alias: z.string(),
  address: z.string().nullable(),
  ports: z.array(serverTunnelPortSchema),
  created: z.string(),
});

export const serverTunnelMembershipSchema = z.object({
  name: z.string(),
  alias: z.string(),
  address: z.string().nullable(),
  created: z.string(),
});

export const serverTunnelNameSchema = z
  .string()
  .min(1)
  .max(63)
  .regex(
    /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
    'Must only contain lowercase letters, digits and dashes, and must not start or end with a dash',
  )
  .refine((name) => !/^[0-9a-f]{8}$/.test(name), {
    message: 'Must not be eight hexadecimal characters, which is reserved for the address every server keeps',
  });

export const serverTunnelSchema = z.object({
  supported: z.boolean(),
  tunnel: serverTunnelMembershipSchema.nullable(),
  ports: z.array(serverTunnelPortSchema),
  allocationPorts: z.array(z.number()),
  outgoing: z.array(serverTunnelPeerSchema),
  incoming: z.array(serverTunnelPeerSchema),
});

export const serverTunnelJoinSchema = z.object({
  name: serverTunnelNameSchema.nullable().optional(),
});

export const serverTunnelRenameSchema = z.object({
  name: serverTunnelNameSchema,
});

export const serverTunnelPortsEditSchema = z.object({
  ports: z.array(serverTunnelPortSchema.omit({ created: true })),
});

export const serverTunnelConnectionCreateSchema = z.object({
  server: z.string(),
});
