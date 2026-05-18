import { ModalProps, Stack } from '@mantine/core';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useRef, useState } from 'react';
import { z } from 'zod';
import { httpErrorToHuman } from '@/api/axios.ts';
import createSubuser from '@/api/server/subusers/createSubuser.ts';
import Button from '@/elements/Button.tsx';
import Captcha, { CaptchaRef } from '@/elements/Captcha.tsx';
import TagsInput from '@/elements/input/TagsInput.tsx';
import TextInput from '@/elements/input/TextInput.tsx';
import { Modal, ModalFooter } from '@/elements/modals/Modal.tsx';
import PermissionSelector from '@/elements/PermissionSelector.tsx';
import { serverSubuserCreateSchema } from '@/lib/schemas/server/subusers.ts';
import { useModalForm } from '@/plugins/useModalForm.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useGlobalStore } from '@/stores/global.ts';
import { useServerStore } from '@/stores/server.ts';

export default function SubuserCreateModal({ opened, onClose }: ModalProps) {
  const { t } = useTranslations();
  const { addToast } = useToast();
  const { server, addSubuser } = useServerStore();
  const { availablePermissions } = useGlobalStore();

  const captchaRef = useRef<CaptchaRef>(null);
  const [loading, setLoading] = useState(false);

  const { form, onClose: handleClose } = useModalForm<z.infer<typeof serverSubuserCreateSchema>>(
    {
      initialValues: {
        email: '',
        permissions: [],
        ignoredFiles: [],
      },
      validateInputOnBlur: true,
      validate: zod4Resolver(serverSubuserCreateSchema),
    },
    onClose,
  );

  const doCreate = () => {
    setLoading(true);

    captchaRef.current?.getToken().then((captcha) => {
      createSubuser(server.uuid, {
        email: form.values.email,
        permissions: Array.from(form.values.permissions),
        ignoredFiles: form.values.ignoredFiles,
        captcha,
      })
        .then((subuser) => {
          addSubuser(subuser);
          addToast(t('pages.server.subusers.modal.createSubuser.toast.created', {}), 'success');
          handleClose();
        })
        .catch((msg) => {
          addToast(httpErrorToHuman(msg), 'error');
        })
        .finally(() => setLoading(false));
    });
  };

  return (
    <Modal
      title={t('pages.server.subusers.modal.createSubuser.title', {})}
      onClose={handleClose}
      opened={opened}
      size='95%'
    >
      <form onSubmit={form.onSubmit(() => doCreate())}>
        <Stack>
          <TextInput
            withAsterisk
            label={t('pages.server.subusers.modal.createSubuser.form.email', {})}
            placeholder={t('pages.server.subusers.modal.createSubuser.form.emailPlaceholder', {})}
            {...form.getInputProps('email')}
          />

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

          <Captcha ref={captchaRef} />

          <ModalFooter>
            <Button type='submit' loading={loading} disabled={!form.isValid()}>
              {t('common.button.create', {})}
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
