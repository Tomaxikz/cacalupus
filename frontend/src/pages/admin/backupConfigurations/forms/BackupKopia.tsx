import { UseFormReturnType } from '@mantine/form';
import { z } from 'zod';
import Divider from '@/elements/Divider.tsx';
import Group from '@/elements/Group.tsx';
import MultiKeyValueInput from '@/elements/input/MultiKeyValueInput.tsx';
import PasswordInput from '@/elements/input/PasswordInput.tsx';
import TextInput from '@/elements/input/TextInput.tsx';
import Stack from '@/elements/Stack.tsx';
import Title from '@/elements/Title.tsx';
import { adminBackupConfigurationKopiaSchema } from '@/lib/schemas/admin/backupConfigurations.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

export default function BackupKopia({
  form,
}: {
  form: UseFormReturnType<z.infer<typeof adminBackupConfigurationKopiaSchema>>;
}) {
  const { t } = useTranslations();

  return (
    <Stack gap='xs' mt='md'>
      <Stack gap={0}>
        <Title order={2}>{t('pages.admin.backupConfigurations.tabs.general.page.kopia.title', {})}</Title>
        <Divider />
      </Stack>

      <Stack>
        <Group grow>
          <TextInput
            withAsterisk
            label={t('pages.admin.backupConfigurations.tabs.general.page.kopia.form.url', {})}
            placeholder='https://kopia.example.com:51515'
            key={form.key('url')}
            {...form.getInputProps('url')}
          />
          <TextInput
            withAsterisk
            label={t('pages.admin.backupConfigurations.tabs.general.page.kopia.form.fingerprint', {})}
            placeholder='48537cce...398d40f7'
            key={form.key('fingerprint')}
            {...form.getInputProps('fingerprint')}
          />
        </Group>

        <Group grow>
          <TextInput
            withAsterisk
            label={t('common.form.username', {})}
            key={form.key('username')}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            withAsterisk
            label={t('common.form.password', {})}
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
        </Group>

        <MultiKeyValueInput
          label={t('pages.admin.backupConfigurations.tabs.general.page.kopia.form.tags', {})}
          allowReordering={false}
          options={form.values.tags}
          onChange={(e) => form.setFieldValue('tags', e)}
        />
      </Stack>
    </Stack>
  );
}
