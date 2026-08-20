import { axiosInstance } from '@/api/axios.ts';

export default async (nestUuid: string, nestEggUuid: string, url: string): Promise<void> => {
  await axiosInstance.post(`/api/admin/nests/${nestUuid}/eggs/${nestEggUuid}/update/import/url`, { url });
};
