import { ReactNode } from 'react';
import { makeComponentHookable } from 'shared';
import Copyright from '@/elements/Copyright.tsx';
import { useAuth } from '@/providers/AuthProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import Alert from './Alert.tsx';

interface LayoutProps {
  children: ReactNode;
  isNormal: boolean;
}

function Container({ children, isNormal }: LayoutProps) {
  const { t } = useTranslations();
  const { impersonating } = useAuth();

  return (
    <div
      className={
        isNormal
          ? 'flex flex-col justify-between min-w-full h-full'
          : 'flex flex-col justify-between h-full overflow-auto p-4'
      }
    >
      <div>
        {impersonating && (
          <Alert color='yellow' className='mt-2 mx-2'>
            {t('elements.container.alert.impersonating', {})}
          </Alert>
        )}

        {children}
      </div>
      <div className='my-2 text-xs transition-all flex flex-col text-gray-400 mr-12'>
        {window.extensionContext.extensionRegistry.pages.global.copyright.prependedComponents.map(
          (Component, index) => (
            <Component key={`global-copyright-prepended-${index}`} />
          ),
        )}

        <Copyright className='justify-end' />

        {window.extensionContext.extensionRegistry.pages.global.copyright.appendedComponents.map((Component, index) => (
          <Component key={`global-copyright-appended-${index}`} />
        ))}
      </div>
    </div>
  );
}

export default makeComponentHookable(Container);
