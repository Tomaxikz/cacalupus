import { ModalProps } from '@mantine/core';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import duplicateAnnouncement from '@/api/admin/announcements/duplicateAnnouncement.ts';
import ConfirmationModal from '@/elements/modals/ConfirmationModal.tsx';
import { adminAnnouncementSchema } from '@/lib/schemas/admin/announcements.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

export default function AnnouncementDuplicateModal({
  announcement,
  ...props
}: Omit<ModalProps, 'children'> & { announcement: z.infer<typeof adminAnnouncementSchema> }) {
  const { t } = useTranslations();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const doDuplicate = () =>
    duplicateAnnouncement(announcement.uuid).then((duplicated) => {
      addToast(t('common.toast.duplicated', { resource: t('pages.admin.announcements.resourceName', {}) }), 'success');
      props.onClose();
      navigate(`/admin/announcements/${duplicated.uuid}`);
    });

  return (
    <ConfirmationModal
      {...props}
      title={t('common.modal.duplicate.title', { resource: t('pages.admin.announcements.resourceName', {}) })}
      confirm={t('common.button.duplicate', {})}
      confirmColor='blue'
      onConfirmed={doDuplicate}
    >
      {t('pages.admin.announcements.tabs.general.page.modal.duplicate.content', {
        title: announcement.title,
      }).md()}
    </ConfirmationModal>
  );
}
