import { forwardRef, memo, useRef } from 'react';
import { FileOpenMode } from 'shared/src/registries/pages/server/files.ts';
import { z } from 'zod';
import { ContextMenuToggle } from '@/elements/ContextMenu.tsx';
import Checkbox from '@/elements/input/Checkbox.tsx';
import { TableData, TableRow } from '@/elements/Table.tsx';
import FormattedTimestamp from '@/elements/time/FormattedTimestamp.tsx';
import { serverDirectoryEntrySchema } from '@/lib/schemas/server/files.ts';
import { bytesToString } from '@/lib/size.ts';
import FileRowContextMenu from '@/pages/server/files/FileRowContextMenu.tsx';
import { useServerCan } from '@/plugins/usePermissions.ts';
import { useFileManager } from '@/providers/FileManagerProvider.tsx';
import FileMassContextMenu from './FileMassContextMenu.tsx';
import FileRowIcon from './FileRowIcon.tsx';

interface FileRowProps {
  file: z.infer<typeof serverDirectoryEntrySchema>;
  handleOpen: (openMode: FileOpenMode) => void;
  openMode: FileOpenMode;
  isSelected: boolean;
  isActing: boolean;
  multipleSelected: boolean;
}

const FileRow = forwardRef<HTMLTableRowElement, FileRowProps>(function FileRow(
  { file, handleOpen, openMode, isSelected, isActing, multipleSelected },
  ref,
) {
  const canOpenActionBar = useServerCan(['files.read-content', 'files.archive', 'files.update', 'files.delete'], true);
  const fileManagerContext = useFileManager();
  const canOpenFile = useServerCan('files.read-content');

  const { doSelectFiles, addSelectedFile, removeSelectedFile, clickOnce, preferPhysicalSize } = fileManagerContext;

  const toggleSelected = () => (isSelected ? removeSelectedFile(file) : addSelectedFile(file));

  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    clickCount.current += 1;

    if (clickTimer.current) return;

    if (e.shiftKey) {
      addSelectedFile(file);
    } else if (isSelected) {
      if (multipleSelected) {
        doSelectFiles([file]);
      } else {
        removeSelectedFile(file);
      }
    } else {
      doSelectFiles([file]);
    }

    clickTimer.current = setTimeout(() => {
      if (clickCount.current >= 2 && canOpenFile) {
        handleOpen(openMode);
      }

      clickCount.current = 0;
      clickTimer.current = null;
    }, 250);
  };

  // Determine background color based on state
  const getBgColor = () => {
    // if (isOver && isValidDropTarget) {
    //   return 'var(--mantine-color-green-light)';
    // }
    if (isActing) {
      return 'var(--mantine-color-orange-light)';
    }
    if (isSelected) {
      return 'var(--mantine-color-blue-light)';
    }
    return undefined;
  };

  return (
    <FileMassContextMenu>
      {({ openMassMenu }) => (
        <FileRowContextMenu file={file} openMode={openMode}>
          {({ items, openMenu }) => (
            <TableRow
              ref={ref}
              className={clickOnce && canOpenFile && openMode.openable ? 'cursor-pointer select-none' : 'select-none'}
              bg={getBgColor()}
              onContextMenu={(e) => {
                e.preventDefault();
                if (isSelected) {
                  openMassMenu(e.pageX, e.pageY);
                } else {
                  openMenu(e.clientX, e.clientY);
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                if (clickOnce && canOpenFile) {
                  handleOpen(openMode);
                } else {
                  handleClick(e);
                }
              }}
            >
              {canOpenActionBar ? (
                <td className='pl-4 relative cursor-pointer w-10 text-center py-2'>
                  <Checkbox
                    id={file.name}
                    checked={isSelected}
                    classNames={{ input: 'cursor-pointer!' }}
                    onChange={toggleSelected}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
              ) : (
                <td className='w-0'></td>
              )}

              <TableData className='w-full max-w-0'>
                <span className='flex items-center gap-4 leading-[100%] min-w-0' title={file.name}>
                  <FileRowIcon className='shrink-0 text-gray-400' file={file} fileManagerContext={fileManagerContext} />
                  <span className='truncate'>{file.name}</span>
                </span>
              </TableData>

              <TableData>
                <span className='flex items-center gap-4 leading-[100%] min-w-fit text-nowrap'>
                  {bytesToString(preferPhysicalSize ? file.sizePhysical : file.size)}
                </span>
              </TableData>

              <TableData className='hidden md:table-cell min-w-fit text-nowrap'>
                <FormattedTimestamp timestamp={file.modified} />
              </TableData>

              <ContextMenuToggle items={items} openMenu={openMenu} />
            </TableRow>
          )}
        </FileRowContextMenu>
      )}
    </FileMassContextMenu>
  );
});

export default memo(FileRow);
