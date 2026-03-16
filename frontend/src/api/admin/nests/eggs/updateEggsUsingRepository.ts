import { axiosInstance } from '@/api/axios.ts';

export default async (nestUuid: string, eggUuids: string[]): Promise<{ updated: number }> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`/api/admin/nests/${nestUuid}/eggs/update/repository`, { egg_uuids: eggUuids })
      .then(({ data }) => resolve(data))
      .catch(reject);
  });
};
