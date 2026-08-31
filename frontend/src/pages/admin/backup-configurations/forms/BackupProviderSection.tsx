import { ReactNode } from 'react';
import Divider from '@/elements/Divider.tsx';
import Stack from '@/elements/Stack.tsx';
import Title from '@/elements/Title.tsx';

export default function BackupProviderSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack gap='xs' mt='md'>
      <Stack gap={0}>
        <Title order={2}>{title}</Title>
        <Divider />
      </Stack>

      {children}
    </Stack>
  );
}
