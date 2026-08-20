import { ModalProps } from '@mantine/core';
import { FormEvent, useEffect, useState } from 'react';
import { z } from 'zod';
import updateEggUsingUrl from '@/api/admin/nests/eggs/updateEggUsingUrl.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import Button from '@/elements/Button.tsx';
import TextInput from '@/elements/input/TextInput.tsx';
import FormModal from '@/elements/modals/FormModal.tsx';
import { ModalFooter } from '@/elements/modals/Modal.tsx';
import Stack from '@/elements/Stack.tsx';
import { adminEggSchema } from '@/lib/schemas/admin/eggs.ts';
import { adminNestSchema } from '@/lib/schemas/admin/nests.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

export default function EggUpdateUrlModal({
  nest,
  egg,
  onUpdated,
  ...props
}: ModalProps & {
  nest: z.infer<typeof adminNestSchema>;
  egg: z.infer<typeof adminEggSchema>;
  onUpdated: () => void;
}) {
  const { t } = useTranslations();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl('');
  }, [props.opened]);

  const doUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    updateEggUsingUrl(nest.uuid, egg.uuid, url)
      .then(() => {
        onUpdated();
        props.onClose();
      })
      .catch((msg) => addToast(httpErrorToHuman(msg), 'error'))
      .finally(() => setLoading(false));
  };

  return (
    <FormModal
      title={t('pages.admin.nests.tabs.eggs.page.modal.updateUrl.title', {})}
      loading={loading}
      {...props}
      onSubmit={doUpdate}
    >
      <Stack>
        <TextInput
          withAsterisk
          label={t('pages.admin.nests.tabs.eggs.page.modal.updateUrl.url', {})}
          description={t('pages.admin.nests.tabs.eggs.page.modal.updateUrl.urlDescription', {})}
          placeholder='https://example.com/egg.json'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <ModalFooter>
          <Button type='submit' loading={loading} disabled={url.length < 1}>
            {t('common.button.update', {})}
          </Button>
          <Button variant='default' onClick={props.onClose}>
            {t('common.button.close', {})}
          </Button>
        </ModalFooter>
      </Stack>
    </FormModal>
  );
}
