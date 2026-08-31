import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { serializeForApi } from '@/lib/api-transform.ts';
import { adminNodeTunnelUpdateSchema } from '@/lib/schemas/admin/nodeTunnel.ts';

export default async (nodeUuid: string, data: z.infer<typeof adminNodeTunnelUpdateSchema>): Promise<void> => {
  await axiosInstance.patch(`/api/admin/nodes/${nodeUuid}/tunnel`, serializeForApi(adminNodeTunnelUpdateSchema, data));
};
