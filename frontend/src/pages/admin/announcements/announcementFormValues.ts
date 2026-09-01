import { z } from 'zod';
import { adminAnnouncementSchema, adminAnnouncementUpdateSchema } from '@/lib/schemas/admin/announcements.ts';

type AnnouncementFormValues = z.infer<typeof adminAnnouncementUpdateSchema>;

export const announcementEmptyFormValues: AnnouncementFormValues = {
  type: 'info',
  enabled: true,
  enabledStart: null,
  enabledEnd: null,
  dismissible: false,
  dismissibleEnd: null,
  title: '',
  titleTranslations: {},
  content: '',
  contentTranslations: {},
  locations: [],
  nodes: [],
  backupConfigurations: [],
  eggs: [],
};

export const announcementToFormValues = (
  announcement: z.infer<typeof adminAnnouncementSchema>,
): Partial<AnnouncementFormValues> => ({
  type: announcement.type,
  enabled: announcement.enabled,
  enabledStart: announcement.enabledStart,
  enabledEnd: announcement.enabledEnd,
  dismissible: announcement.dismissible,
  dismissibleEnd: announcement.dismissibleEnd,
  title: announcement.title,
  titleTranslations: announcement.titleTranslations,
  content: announcement.content,
  contentTranslations: announcement.contentTranslations,
  locations: announcement.locations,
  nodes: announcement.nodes,
  backupConfigurations: announcement.backupConfigurations,
  eggs: announcement.eggs,
});
