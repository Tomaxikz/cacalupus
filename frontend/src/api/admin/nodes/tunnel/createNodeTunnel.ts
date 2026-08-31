import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { serializeForApi } from '@/lib/api-transform.ts';
import { adminNodeTunnelCreateSchema } from '@/lib/schemas/admin/nodeTunnel.ts';

export default async (nodeUuid: string, data: z.infer<typeof adminNodeTunnelCreateSchema>): Promise<void> => {
  await axiosInstance.post(`/api/admin/nodes/${nodeUuid}/tunnel`, serializeForApi(adminNodeTunnelCreateSchema, data));
};
