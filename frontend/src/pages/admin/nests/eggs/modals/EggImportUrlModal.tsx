import { ModalProps } from '@mantine/core';
import { FormEvent, useEffect, useState } from 'react';
import { z } from 'zod';
import importEggsFromUrl from '@/api/admin/nests/eggs/importEggsFromUrl.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import Button from '@/elements/Button.tsx';
import TagsInput from '@/elements/input/TagsInput.tsx';
import FormModal from '@/elements/modals/FormModal.tsx';
import { ModalFooter } from '@/elements/modals/Modal.tsx';
import Stack from '@/elements/Stack.tsx';
import { adminNestSchema } from '@/lib/schemas/admin/nests.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

export default function EggImportUrlModal({
  nest,
  onImported,
  ...props
}: ModalProps & {
  nest: z.infer<typeof adminNestSchema>;
  onImported: () => void;
}) {
  const { t, tItem } = useTranslations();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    setUrls([]);
  }, [props.opened]);

  const doImport = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    importEggsFromUrl(nest.uuid, urls)
      .then(({ eggs, failures }) => {
        if (eggs.length > 0) {
          addToast(
            t('pages.admin.nests.tabs.eggs.page.toast.importedBulk', { eggs: tItem('egg', eggs.length) }),
            'success',
          );
        }

        for (const failure of failures) {
          addToast(
            t('pages.admin.nests.tabs.eggs.page.toast.importFailed', { url: failure.url, error: failure.error }),
            'error',
          );
        }

        onImported();
        props.onClose();
      })
      .catch((msg) => addToast(httpErrorToHuman(msg), 'error'))
      .finally(() => setLoading(false));
  };

  return (
    <FormModal
      title={t('pages.admin.nests.tabs.eggs.page.modal.importUrl.title', {})}
      loading={loading}
      {...props}
      onSubmit={doImport}
    >
      <Stack>
        <TagsInput
          withAsterisk
          label={t('pages.admin.nests.tabs.eggs.page.modal.importUrl.urls', {})}
          description={t('pages.admin.nests.tabs.eggs.page.modal.importUrl.urlsDescription', {})}
          placeholder='https://example.com/egg.json'
          allowReordering={false}
          value={urls}
          onChange={setUrls}
        />

        <ModalFooter>
          <Button type='submit' loading={loading} disabled={urls.length < 1}>
            {t('common.button.import', {})}
          </Button>
          <Button variant='default' onClick={props.onClose}>
            {t('common.button.close', {})}
          </Button>
        </ModalFooter>
      </Stack>
    </FormModal>
  );
}
