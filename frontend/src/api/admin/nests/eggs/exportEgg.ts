import { untransformedAxiosInstance } from '@/api/axios.ts';

export default async (nestUuid: string, eggUuid: string): Promise<object> => {
  return new Promise((resolve, reject) => {
    untransformedAxiosInstance
      .get(`/api/admin/nests/${nestUuid}/eggs/${eggUuid}/export`)
      .then(({ data }) => resolve(data))
      .catch(reject);
  });
};
