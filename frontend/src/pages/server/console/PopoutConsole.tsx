import { useEffect } from 'react';
import { ServerCan } from '@/elements/Can.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useRelativePageStore } from '@/stores/relativePage.ts';
import { useServerStore } from '@/stores/server.ts';
import ServerPowerControls from './stats/ServerPowerControls.tsx';
import Console from './terminal/Console.tsx';

export default function PopoutConsole() {
  const { t } = useTranslations();
  const server = useServerStore((state) => state.server);
  const setTitle = useRelativePageStore((state) => state.setTitle);

  useEffect(() => {
    const label = t('pages.server.console.popout.windowTitle', {});
    setTitle(server.name ? `${server.name} - ${label}` : label);
  }, [server.name, setTitle, t]);

  return (
    <div className='fixed inset-0 z-[120] flex flex-col gap-3 bg-(--mantine-color-body) p-3'>
      <div className='flex flex-row items-start justify-between gap-3 shrink-0'>
        <div className='flex flex-col min-w-0'>
          <span className='font-semibold truncate'>{server.name}</span>
          <span className='text-xs text-(--mantine-color-dimmed)! truncate'>
            {server.description || t('pages.server.console.popout.returnHint', {})}
          </span>
        </div>
        <ServerCan action={['control.start', 'control.stop', 'control.restart']} matchAny>
          <ServerPowerControls />
        </ServerCan>
      </div>

      <div className='flex-1 min-h-0 flex flex-col'>
        <Console popout />
      </div>
    </div>
  );
}
