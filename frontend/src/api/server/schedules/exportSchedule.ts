import { untransformedAxiosInstance } from '@/api/axios.ts';

export default async (serverUuid: string, scheduleUuid: string): Promise<object> => {
  return new Promise((resolve, reject) => {
    untransformedAxiosInstance
      .get(`/api/client/servers/${serverUuid}/schedules/${scheduleUuid}/export`)
      .then(({ data }) => resolve(data))
      .catch(reject);
  });
};
