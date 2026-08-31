import { useCallback } from 'react';
import deleteAssetsRequest from '@/api/admin/assets/deleteAssets.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

export function useDeleteAssets() {
  const { t, tItem } = useTranslations();
  const { addToast } = useToast();

  return useCallback(
    (names: string[]): Promise<boolean> =>
      deleteAssetsRequest(names)
        .then(({ deleted }) => {
          addToast(
            names.length === 1
              ? t('pages.admin.assets.toast.assetDeleted', {})
              : t('pages.admin.assets.toast.assetsDeleted', { assets: tItem('asset', deleted) }),
            'success',
          );
          return true;
        })
        .catch((msg) => {
          addToast(httpErrorToHuman(msg), 'error');
          return false;
        }),
    [t, tItem, addToast],
  );
}
