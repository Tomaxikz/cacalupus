import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import Alert from '@/elements/Alert.tsx';
import Button from '@/elements/Button.tsx';
import { urlIsMissingPort } from '@/lib/url.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

export default function UrlMissingPortAlert({
  url,
  defaultPort,
  onAddPort,
  children,
}: {
  url: string;
  defaultPort: number;
  onAddPort?: () => void;
  children: ReactNode;
}) {
  const { t } = useTranslations();

  if (!urlIsMissingPort(url)) {
    return null;
  }

  return (
    <Alert color='yellow' icon={<FontAwesomeIcon icon={faTriangleExclamation} />}>
      <div className='flex flex-col items-start gap-2'>
        {children}
        {onAddPort && (
          <Button size='compact-xs' variant='light' color='yellow' onClick={onAddPort}>
            {t('common.button.addDefaultPort', { port: String(defaultPort) })}
          </Button>
        )}
      </div>
    </Alert>
  );
}
