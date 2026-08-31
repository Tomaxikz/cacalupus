import { axiosInstance } from '@/api/axios.ts';

export default async (uuid: string, connection: string, incoming: boolean): Promise<void> => {
  await axiosInstance.delete(`/api/client/servers/${uuid}/tunnel/connections/${connection}`, {
    params: { incoming },
  });
};
