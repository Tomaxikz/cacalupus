import { axiosInstance } from '@/api/axios.ts';

export default async (serverUuid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`/api/admin/servers/${serverUuid}/transfer/cancel`)
      .then(() => resolve())
      .catch(reject);
  });
};
