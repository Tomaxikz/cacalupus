import { z } from 'zod';

export const adminNodeTunnelSchema = z.object({
  host: z.string(),
  port: z.number(),
  certSha256: z.string().nullable(),
  created: z.string(),
});

export const adminNodeTunnelStatusSchema = z.object({
  supported: z.boolean(),
  connected: z.boolean(),
  epoch: z.number().nullable(),
});

export const adminNodeTunnelViewSchema = z.object({
  tunnel: adminNodeTunnelSchema.nullable(),
  status: adminNodeTunnelStatusSchema.nullable(),
});

export const adminNodeTunnelCreateSchema = z.object({
  host: z.string().min(1).max(255),
  port: z.number().int().min(1).max(65535),
});

export const adminNodeTunnelUpdateSchema = z.object({
  host: z.string().min(1).max(255).nullable().optional(),
  port: z.number().int().min(1).max(65535).nullable().optional(),
});

export const adminNodeTunnelPeerMetricsSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  role: z.string(),
  remoteAddr: z.string(),
  establishedSecs: z.number(),
  path: z.object({
    rttMs: z.number(),
    currentMtu: z.number(),
    lostPackets: z.number(),
    congestionEvents: z.number(),
  }),
  relay: z.object({
    streamBytesIn: z.number(),
    streamBytesOut: z.number(),
    datagramBytesIn: z.number(),
    datagramBytesOut: z.number(),
    streamsOpen: z.number(),
    streamsTotal: z.number(),
  }),
  flows: z.object({
    open: z.number(),
    openedTotal: z.number(),
    tcpOpen: z.number(),
  }),
  drops: z.object({
    sendBufferFull: z.number(),
    unknownFlow: z.number(),
    fragTimeout: z.number(),
    fragLimit: z.number(),
    oversize: z.number(),
    malformed: z.number(),
  }),
});

export const adminNodeTunnelMetricsSchema = z.object({
  node: z.object({
    uptimeSecs: z.number(),
    epoch: z.number(),
    remoteLink: z.string(),
    frontends: z.number(),
    snapshotsApplied: z.number(),
    localFlowsOpen: z.number(),
    localDrops: z.number(),
    frozenFlows: z.number(),
    peersConnected: z.number(),
  }),
  peers: z.array(adminNodeTunnelPeerMetricsSchema),
});
