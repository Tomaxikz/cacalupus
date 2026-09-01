import { ModalProps } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { z } from 'zod';
import deleteDatabaseHostDatabase from '@/api/admin/database-hosts/deleteDatabaseHostDatabase.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import ForceDeleteModal from '@/elements/modals/ForceDeleteModal.tsx';
import { queryKeys } from '@/lib/queryKeys.ts';
import { adminServerDatabaseBaseSchema } from '@/lib/schemas/admin/servers.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

type Props = Omit<ModalProps, 'title' | 'children'> & {
  hostUuid: string;
  serverUuid: string;
  database: z.infer<typeof adminServerDatabaseBaseSchema>;
};

export default function DatabaseHostDatabaseDeleteModal({ hostUuid, serverUuid, database, ...props }: Props) {
  const { t } = useTranslations();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [deleteDoForce, setDeleteDoForce] = useState(false);

  const doDelete = () =>
    deleteDatabaseHostDatabase(hostUuid, database.uuid, { force: deleteDoForce })
      .then(() => {
        addToast(t('pages.admin.databaseHosts.tabs.databases.page.modal.delete.toast.deleted', {}), 'success');
        props.onClose();
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.databaseHosts.databases(hostUuid) });
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.servers.databases(serverUuid) });
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });

  return (
    <ForceDeleteModal
      title={t('pages.admin.databaseHosts.tabs.databases.page.modal.delete.title', {})}
      name={database.name}
      force={deleteDoForce}
      onForceChange={setDeleteDoForce}
      forceWarning={t('pages.admin.databaseHosts.tabs.databases.page.modal.delete.alert.forceWarning', {})}
      onConfirmed={doDelete}
      {...props}
    />
  );
}
