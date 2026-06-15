import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { join } from 'pathe';
import { useSearchParams } from 'react-router';
import { TableData, TableRow } from '@/elements/Table.tsx';
import { useDraggedFileMove } from '@/pages/server/files/hooks/useDraggedFileMove.ts';
import { useFileManager } from '@/providers/contexts/fileManagerContext.ts';

function FileParentDirectoryRow() {
  const [_, setSearchParams] = useSearchParams();
  const { browsingDirectory, doSelectFiles } = useFileManager();
  const { isDropTarget, getDropHandlers } = useDraggedFileMove();

  const parentDirectory = join(browsingDirectory, '..');
  const parentIsDropTarget = isDropTarget(parentDirectory);

  const openParentDirectory = () => {
    doSelectFiles([]);
    setSearchParams({ directory: parentDirectory });
  };

  return (
    <TableRow
      className='cursor-pointer select-none'
      bg={parentIsDropTarget ? 'var(--mantine-color-green-light)' : undefined}
      onClick={openParentDirectory}
      {...getDropHandlers(parentDirectory)}
    >
      <td className='pl-4 relative w-10 py-2'></td>

      <TableData className='w-full max-w-0'>
        <span className='flex items-center gap-4 min-w-0' title='..'>
          <span className='inline-flex h-6 w-4 shrink-0' />
          <FontAwesomeIcon className='shrink-0 text-(--mantine-color-dimmed)' icon={faFolder} />
          <span className={classNames('truncate', parentIsDropTarget && 'font-medium')}>..</span>
        </span>
      </TableData>

      <TableData></TableData>
      <TableData className='hidden md:table-cell'></TableData>
      <td className='w-0'></td>
    </TableRow>
  );
}

export default FileParentDirectoryRow;
