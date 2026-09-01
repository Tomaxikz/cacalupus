import { ModalProps } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import moveEgg from '@/api/admin/nests/eggs/moveEgg.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import Button from '@/elements/Button.tsx';
import NestSelect from '@/elements/input/NestSelect.tsx';
import { Modal, ModalFooter } from '@/elements/modals/Modal.tsx';
import Stack from '@/elements/Stack.tsx';
import { adminEggSchema } from '@/lib/schemas/admin/eggs.ts';
import { adminNestSchema } from '@/lib/schemas/admin/nests.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

export default function EggMoveModal({
  nest,
  egg,
  ...props
}: ModalProps & { nest: z.infer<typeof adminNestSchema>; egg: z.infer<typeof adminEggSchema> }) {
  const { addToast } = useToast();
  const { t } = useTranslations();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedNest, setSelectedNest] = useState<z.infer<typeof adminNestSchema> | null>(null);

  const doMove = () => {
    if (!selectedNest) {
      return;
    }

    setLoading(true);

    moveEgg(nest.uuid, egg.uuid, selectedNest.uuid)
      .then(() => {
        addToast(t('pages.admin.nests.tabs.eggs.page.toast.moved', {}), 'success');
        navigate(`/admin/nests/${selectedNest.uuid}/eggs/${egg.uuid}`);

        props.onClose();
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal title={t('pages.admin.nests.tabs.eggs.page.modal.move.title', {})} {...props}>
      <Stack>
        <NestSelect
          withAsterisk
          label={t('common.form.nest', {})}
          value={selectedNest?.uuid ?? null}
          onChange={(_, next) => setSelectedNest(next)}
        />

        <ModalFooter>
          <Button onClick={doMove} loading={loading} disabled={!selectedNest}>
            {t('common.button.move', {})}
          </Button>
          <Button variant='default' onClick={props.onClose}>
            {t('common.button.close', {})}
          </Button>
        </ModalFooter>
      </Stack>
    </Modal>
  );
}
