import { axiosInstance } from '@/api/axios.ts';

export default async (nodeUuid: string): Promise<void> => {
  await axiosInstance.post(`/api/admin/nodes/${nodeUuid}/tunnel/rotate`);
};
