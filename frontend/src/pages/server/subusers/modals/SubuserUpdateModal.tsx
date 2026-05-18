import { ModalProps, Stack } from '@mantine/core';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useState } from 'react';
import { z } from 'zod';
import { httpErrorToHuman } from '@/api/axios.ts';
import updateSubuser from '@/api/server/subusers/updateSubuser.ts';
import Button from '@/elements/Button.tsx';
import TagsInput from '@/elements/input/TagsInput.tsx';
import { Modal, ModalFooter } from '@/elements/modals/Modal.tsx';
import PermissionSelector from '@/elements/PermissionSelector.tsx';
import { serverSubuserSchema, serverSubuserUpdateSchema } from '@/lib/schemas/server/subusers.ts';
import { useModalForm } from '@/plugins/useModalForm.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useGlobalStore } from '@/stores/global.ts';
import { useServerStore } from '@/stores/server.ts';

type Props = ModalProps & {
  subuser: z.infer<typeof serverSubuserSchema>;
};

export default function SubuserUpdateModal({ subuser, opened, onClose }: Props) {
  const { t } = useTranslations();
  const { addToast } = useToast();
  const { server } = useServerStore();
  const { availablePermissions } = useGlobalStore();

  const [loading, setLoading] = useState(false);

  const { form, onClose: handleClose } = useModalForm<z.infer<typeof serverSubuserUpdateSchema>>(
    {
      initialValues: {
        permissions: subuser.permissions,
        ignoredFiles: subuser.ignoredFiles,
      },
      validateInputOnBlur: true,
      validate: zod4Resolver(serverSubuserUpdateSchema),
    },
    onClose,
  );

  const doUpdate = () => {
    setLoading(true);

    updateSubuser(server.uuid, subuser.user.uuid, {
      permissions: Array.from(form.values.permissions),
      ignoredFiles: form.values.ignoredFiles,
    })
      .then(() => {
        subuser.permissions = Array.from(form.values.permissions);
        subuser.ignoredFiles = form.values.ignoredFiles;
        handleClose();
        addToast(t('pages.server.subusers.modal.updateSubuser.toast.updated', {}), 'success');
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      title={t('pages.server.subusers.modal.updateSubuser.title', {})}
      onClose={handleClose}
      opened={opened}
      size='95%'
    >
      <form onSubmit={form.onSubmit(() => doUpdate())}>
        <Stack>
          <PermissionSelector
            label={t('pages.server.subusers.modal.createSubuser.form.permissions', {})}
            permissionsMapType='serverPermissions'
            permissions={availablePermissions.serverPermissions}
            selectedPermissions={form.values.permissions}
            setSelectedPermissions={(permissions) => form.setFieldValue('permissions', permissions)}
          />

          <TagsInput
            label={t('pages.server.subusers.modal.createSubuser.form.ignoredFiles', {})}
            placeholder={t('pages.server.subusers.modal.createSubuser.form.ignoredFiles', {})}
            description={t('pages.server.subusers.modal.createSubuser.form.ignoredFilesDescription', {})}
            {...form.getInputProps('ignoredFiles')}
          />

          <ModalFooter>
            <Button type='submit' loading={loading} disabled={!form.isValid()}>
              {t('common.button.update', {})}
            </Button>
            <Button variant='default' onClick={handleClose}>
              {t('common.button.close', {})}
            </Button>
          </ModalFooter>
        </Stack>
      </form>
    </Modal>
  );
}
