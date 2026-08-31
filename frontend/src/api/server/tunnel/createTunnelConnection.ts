import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { serializeForApi } from '@/lib/api-transform.ts';
import { serverTunnelConnectionCreateSchema } from '@/lib/schemas/server/tunnel.ts';

export default async (uuid: string, data: z.infer<typeof serverTunnelConnectionCreateSchema>): Promise<void> => {
  await axiosInstance.post(
    `/api/client/servers/${uuid}/tunnel/connections`,
    serializeForApi(serverTunnelConnectionCreateSchema, data),
  );
};
