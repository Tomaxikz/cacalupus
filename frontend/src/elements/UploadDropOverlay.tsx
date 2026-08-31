import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { memo } from 'react';

interface UploadDropOverlayProps {
  visible: boolean;
  title: string;
  subtitle: string;
  blur?: boolean;
}

function UploadDropOverlay({ visible, title, subtitle, blur = false }: UploadDropOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={classNames(
        'pointer-events-none fixed inset-0 z-100 flex items-center justify-center',
        blur ? 'backdrop-blur-md bg-black/20' : 'bg-black/50',
      )}
    >
      <div className='bg-(--mantine-color-body) rounded-lg p-8 shadow-2xl border-2 border-dashed border-(--mantine-color-blue-5)'>
        <div className='flex flex-col items-center gap-4'>
          <FontAwesomeIcon icon={faUpload} className='text-6xl text-(--mantine-color-blue-5) animate-bounce' />
          <p className='text-xl font-semibold'>{title}</p>
          <p className='text-sm text-(--mantine-color-dimmed)'>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(UploadDropOverlay);
