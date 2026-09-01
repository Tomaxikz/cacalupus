import { ModalProps } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { z } from 'zod';
import deleteDatabaseAgentHostInstance from '@/api/admin/database-agent-hosts/deleteDatabaseAgentHostInstance.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import ForceDeleteModal from '@/elements/modals/ForceDeleteModal.tsx';
import { queryKeys } from '@/lib/queryKeys.ts';
import { adminDatabaseAgentBaseSchema } from '@/lib/schemas/admin/servers.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

type Props = ModalProps & {
  hostUuid: string;
  instance: z.infer<typeof adminDatabaseAgentBaseSchema>;
};

export default function DatabaseAgentHostInstanceDeleteModal({ hostUuid, instance, ...props }: Props) {
  const { t } = useTranslations();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [force, setForce] = useState(false);

  const doDelete = () =>
    deleteDatabaseAgentHostInstance(hostUuid, instance.uuid, { force })
      .then(() => {
        addToast(
          t('pages.admin.databaseAgentHosts.tabs.instances.page.modal.deleteInstance.toast.deleted', {}),
          'success',
        );
        props.onClose();
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.databaseInstances.all() });
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });

  return (
    <ForceDeleteModal
      {...props}
      title={t('pages.admin.databaseAgentHosts.tabs.instances.page.modal.deleteInstance.title', {})}
      name={instance.name}
      force={force}
      onForceChange={setForce}
      forceWarning={t('pages.admin.databaseAgentHosts.tabs.instances.page.modal.deleteInstance.alert.forceWarning', {})}
      onConfirmed={doDelete}
    />
  );
}
