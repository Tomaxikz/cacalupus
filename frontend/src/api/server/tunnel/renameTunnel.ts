import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { serializeForApi } from '@/lib/api-transform.ts';
import { serverTunnelRenameSchema } from '@/lib/schemas/server/tunnel.ts';

export default async (uuid: string, data: z.infer<typeof serverTunnelRenameSchema>): Promise<void> => {
  await axiosInstance.patch(`/api/client/servers/${uuid}/tunnel`, serializeForApi(serverTunnelRenameSchema, data));
};
