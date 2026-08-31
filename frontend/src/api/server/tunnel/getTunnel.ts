import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { parseFromApi } from '@/lib/api-transform.ts';
import { serverTunnelSchema } from '@/lib/schemas/server/tunnel.ts';

export default async (uuid: string): Promise<z.infer<typeof serverTunnelSchema>> => {
  const { data } = await axiosInstance.get(`/api/client/servers/${uuid}/tunnel`);
  return parseFromApi(serverTunnelSchema, data);
};
