import { ModalProps, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { z } from 'zod';
import { httpErrorToHuman } from '@/api/axios.ts';
import recreateDatabase from '@/api/server/databases/recreateDatabase.ts';
import Button from '@/elements/Button.tsx';
import TextInput from '@/elements/input/TextInput.tsx';
import { Modal, ModalFooter } from '@/elements/modals/Modal.tsx';
import { serverDatabaseSchema } from '@/lib/schemas/server/databases.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useServerStore } from '@/stores/server.ts';

type Props = ModalProps & {
  database: z.infer<typeof serverDatabaseSchema>;
};

export default function DatabaseRecreateModal({ database, opened, onClose }: Props) {
  const { t } = useTranslations();
  const { addToast } = useToast();
  const server = useServerStore((state) => state.server);

  const [enteredName, setEnteredName] = useState('');
  const [loading, setLoading] = useState(false);

  const doRecreate = () => {
    setLoading(true);

    recreateDatabase(server.uuid, database.uuid)
      .then(() => {
        addToast(t('pages.server.databases.modal.recreateDatabase.toast.recreated', {}), 'success');
        onClose();
      })
      .catch((error) => {
        console.error(error);
        addToast(httpErrorToHuman(error), 'error');
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal title={t('pages.server.databases.modal.recreateDatabase.title', {})} onClose={onClose} opened={opened}>
      <Stack>
        <Text>{t('pages.server.databases.modal.recreateDatabase.content', { name: database.name }).md()}</Text>

        <TextInput
          withAsterisk
          label={t('pages.server.databases.form.databaseName', {})}
          placeholder={t('pages.server.databases.form.databaseName', {})}
          value={enteredName}
          onChange={(e) => setEnteredName(e.target.value)}
        />

        <ModalFooter>
          <Button color='red' onClick={doRecreate} loading={loading} disabled={database.name !== enteredName}>
            {t('common.button.recreate', {})}
          </Button>
          <Button variant='default' onClick={onClose}>
            {t('common.button.close', {})}
          </Button>
        </ModalFooter>
      </Stack>
    </Modal>
  );
}
