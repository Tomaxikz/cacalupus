import { httpErrorToHuman } from '@/api/axios.ts';
import { useToast } from '@/providers/ToastProvider.tsx';

export function useHostAction(uuid: string | undefined, setLoading: (loading: boolean) => void) {
  const { addToast } = useToast();

  return (action: (uuid: string) => Promise<unknown>, success: string, onSuccess?: () => void) => {
    if (!uuid) {
      return;
    }

    setLoading(true);

    action(uuid)
      .then(() => {
        addToast(success, 'success');
        onSuccess?.();
      })
      .catch((msg) => addToast(httpErrorToHuman(msg), 'error'))
      .finally(() => setLoading(false));
  };
}
