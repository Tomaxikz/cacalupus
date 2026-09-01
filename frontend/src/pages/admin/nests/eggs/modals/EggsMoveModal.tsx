import { ModalProps } from '@mantine/core';
import { useState } from 'react';
import { z } from 'zod';
import moveEggs from '@/api/admin/nests/eggs/moveEggs.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import Button from '@/elements/Button.tsx';
import NestSelect from '@/elements/input/NestSelect.tsx';
import { Modal, ModalFooter } from '@/elements/modals/Modal.tsx';
import Stack from '@/elements/Stack.tsx';
import { ObjectSet } from '@/lib/objectSet.ts';
import { adminEggSchema } from '@/lib/schemas/admin/eggs.ts';
import { adminNestSchema } from '@/lib/schemas/admin/nests.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

export default function EggsMoveModal({
  nest,
  selectedEggs,
  invalidateEggs,
  ...props
}: ModalProps & {
  nest: z.infer<typeof adminNestSchema>;
  selectedEggs: ObjectSet<z.infer<typeof adminEggSchema>, 'uuid'>;
  invalidateEggs: () => void;
}) {
  const { addToast } = useToast();
  const { t, tItem } = useTranslations();

  const [loading, setLoading] = useState(false);
  const [selectedNest, setSelectedNest] = useState<string | null>(null);

  const doMove = () => {
    if (!selectedNest) {
      return;
    }

    setLoading(true);

    moveEggs(nest.uuid, selectedEggs.keys(), selectedNest)
      .then(({ moved }) => {
        addToast(t('pages.admin.nests.tabs.eggs.page.toast.movedBulk', { eggs: tItem('egg', moved) }), 'success');
        invalidateEggs();
        props.onClose();
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal title={t('pages.admin.nests.tabs.eggs.page.modal.moveBulk.title', {})} {...props}>
      <Stack>
        <NestSelect
          withAsterisk
          label={t('common.form.nest', {})}
          value={selectedNest}
          onChange={(uuid) => setSelectedNest(uuid)}
        />

        <ModalFooter>
          <Button onClick={doMove} loading={loading} disabled={!selectedNest}>
            {t('pages.admin.nests.tabs.eggs.page.modal.moveBulk.confirm', {
              eggs: tItem('egg', selectedEggs.size),
            })}
          </Button>
          <Button variant='default' onClick={props.onClose}>
            {t('common.button.close', {})}
          </Button>
        </ModalFooter>
      </Stack>
    </Modal>
  );
}
