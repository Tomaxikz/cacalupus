import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import Alert from '@/elements/Alert.tsx';
import Button from '@/elements/Button.tsx';
import { AdminCan } from '@/elements/Can.tsx';
import Group from '@/elements/Group.tsx';
import Spinner from '@/elements/Spinner.tsx';
import Stack from '@/elements/Stack.tsx';
import Title from '@/elements/Title.tsx';
import YamlEditor from '@/elements/YamlEditor.tsx';

export default function LiveYamlConfigSection({
  title,
  saveLabel,
  updateAction,
  yaml,
  onYamlChange,
  onSave,
  saving,
  error,
  errorText,
  errorExtra,
}: {
  title: string;
  saveLabel: string;
  updateAction: string;
  yaml: string | null;
  onYamlChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
  errorText: ReactNode;
  errorExtra?: ReactNode;
}) {
  return (
    <div>
      <Group justify='space-between' mb='md'>
        <Title order={4}>{title}</Title>
        <AdminCan action={updateAction} cantSave>
          <Button onClick={onSave} loading={saving} disabled={yaml === null || error !== null}>
            {saveLabel}
          </Button>
        </AdminCan>
      </Group>
      {error ? (
        <Alert color='red' icon={<FontAwesomeIcon icon={faExclamationTriangle} />}>
          <Stack gap='xs'>
            {errorText}
            {errorExtra}
          </Stack>
        </Alert>
      ) : yaml === null ? (
        <Spinner.Centered />
      ) : (
        <div className='rounded-md overflow-hidden'>
          <YamlEditor height='65vh' value={yaml} onChange={(value) => onYamlChange(value ?? '')} onSave={onSave} />
        </div>
      )}
    </div>
  );
}
