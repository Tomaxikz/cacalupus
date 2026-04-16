import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import getCommandSnippets from '@/api/me/command-snippets/getCommandSnippets.ts';
import Button from '@/elements/Button.tsx';
import { ContextMenuProvider } from '@/elements/ContextMenu.tsx';
import AccountContentContainer from '@/elements/containers/AccountContentContainer.tsx';
import Table from '@/elements/Table.tsx';
import { useSearchablePaginatedTable } from '@/plugins/useSearchablePageableTable.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useUserStore } from '@/stores/user.ts';
import CommandSnippetRow from './CommandSnippetRow.tsx';
import CommandSnippetCreateModal from './modals/CommandSnippetCreateModal.tsx';

export default function DashboardCommandSnippets() {
  const { t } = useTranslations();
  const { commandSnippets, setCommandSnippets } = useUserStore();

  const [openModal, setOpenModal] = useState<'create' | null>(null);

  const { loading, search, setSearch, setPage } = useSearchablePaginatedTable({
    fetcher: getCommandSnippets,
    setStoreData: setCommandSnippets,
  });

  return (
    <AccountContentContainer
      title={t('pages.account.commandSnippets.title', {})}
      search={search}
      setSearch={setSearch}
      contentRight={
        <Button onClick={() => setOpenModal('create')} color='blue' leftSection={<FontAwesomeIcon icon={faPlus} />}>
          {t('common.button.create', {})}
        </Button>
      }
      registry={window.extensionContext.extensionRegistry.pages.dashboard.commandSnippets.container}
    >
      <CommandSnippetCreateModal opened={openModal === 'create'} onClose={() => setOpenModal(null)} />

      <ContextMenuProvider>
        <Table
          columns={[
            t('common.table.columns.name', {}),
            t('pages.account.commandSnippets.table.columns.eggs', {}),
            t('common.table.columns.created', {}),
            '',
          ]}
          loading={loading}
          pagination={commandSnippets}
          onPageSelect={setPage}
        >
          {commandSnippets.data.map((snippet) => (
            <CommandSnippetRow key={snippet.uuid} commandSnippet={snippet} />
          ))}
        </Table>
      </ContextMenuProvider>
    </AccountContentContainer>
  );
}
