import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { serializeForApi } from '@/lib/api-transform.ts';
import { serverTunnelPortsEditSchema } from '@/lib/schemas/server/tunnel.ts';

export default async (uuid: string, data: z.infer<typeof serverTunnelPortsEditSchema>): Promise<void> => {
  await axiosInstance.put(
    `/api/client/servers/${uuid}/tunnel/ports`,
    serializeForApi(serverTunnelPortsEditSchema, data),
  );
};
