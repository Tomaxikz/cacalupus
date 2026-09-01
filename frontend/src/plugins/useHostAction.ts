import { httpErrorToHuman } from '@/api/axios.ts';
import { useToast } from '@/providers/ToastProvider.tsx';

export function useHostAction(uuid: string | undefined, setLoading: (loading: boolean) => void) {
  const { addToast } = useToast();

  return <T>(
    action: (uuid: string) => Promise<T>,
    success: string | ((result: T) => string),
    onSuccess?: () => void,
  ) => {
    if (!uuid) {
      return;
    }

    setLoading(true);

    action(uuid)
      .then((result) => {
        addToast(typeof success === 'function' ? success(result) : success, 'success');
        onSuccess?.();
      })
      .catch((msg) => addToast(httpErrorToHuman(msg), 'error'))
      .finally(() => setLoading(false));
  };
}
