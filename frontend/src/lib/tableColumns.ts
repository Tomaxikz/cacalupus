import { getTranslations } from '@/providers/TranslationProvider.tsx';

export const announcementTableColumns = (): string[] => {
  const { t } = getTranslations();
  return [
    t('common.table.columns.id', {}),
    t('common.table.columns.type', {}),
    t('common.table.columns.title', {}),
    t('common.table.columns.enabled', {}),
    t('common.table.columns.created', {}),
  ];
};

export const assetTableColumns = (): string[] => {
  const { t } = getTranslations();
  return [
    '',
    t('common.table.columns.name', {}),
    t('common.table.columns.size', {}),
    t('common.table.columns.created', {}),
  ];
};

export const backupConfigurationTableColumns = ['ID', 'Name', 'Disk', 'Created'];

export const databaseHostTableColumns = ['ID', 'Name', 'Type', 'Created'];

export const databaseHostDatabaseTableColumns = ['Name', 'Server', 'Type', 'Address', 'Username', 'Size', 'Created'];

export const locationDatabaseHostTableColumns = (): string[] => {
  const { t } = getTranslations();
  return [
    t('common.table.columns.id', {}),
    t('common.table.columns.name', {}),
    t('common.table.columns.type', {}),
    t('common.table.columns.added', {}),
    '',
  ];
};

export const locationTableColumns = (): string[] => {
  const { t } = getTranslations();
  return [
    t('common.table.columns.id', {}),
    t('common.table.columns.name', {}),
    t('common.table.columns.backupConfiguration', {}),
    t('common.table.columns.created', {}),
  ];
};

export const eggRepositoryTableColumns = ['ID', 'Name', 'Description', 'Git Repository', 'Created'];

export const mountTableColumns = ['ID', 'Name', 'Source', 'Target', 'Created'];

export const nestTableColumns = ['ID', 'Name', 'Author', 'Description', 'Created'];

export const eggTableColumns = ['ID', 'Name', 'Author', 'Description', 'Created'];

export const eggConfigurationTableColumns = ['ID', 'Order', 'Name', 'Eggs', 'Created'];

export const nodeTableColumns = (): string[] => {
  const { t } = getTranslations();
  return [
    '',
    t('common.table.columns.id', {}),
    t('common.table.columns.name', {}),
    t('common.table.columns.location', {}),
    t('common.table.columns.created', {}),
  ];
};

export const nodeMountTableColumns = (): string[] => {
  const { t } = getTranslations();
  return [
    t('common.table.columns.id', {}),
    t('common.table.columns.name', {}),
    t('pages.admin.nodes.tabs.mounts.page.table.columns.source', {}),
    t('pages.admin.nodes.tabs.mounts.page.table.columns.target', {}),
    t('common.table.columns.added', {}),
    '',
  ];
};

export const nodeAllocationTableColumns = (): string[] => {
  const { t } = getTranslations();
  return [
    '',
    t('common.table.columns.id', {}),
    t('pages.admin.nodes.tabs.backups.page.table.columns.server', {}),
    t('common.table.columns.ip', {}),
    t('pages.admin.nodes.tabs.allocations.page.table.columns.ipAlias', {}),
    t('common.form.port', {}),
    t('common.table.columns.created', {}),
  ];
};

export const oauthProviderTableColumns = [
  'ID',
  'Name',
  'Enabled',
  'Login Only',
  'Link Viewable',
  'User Manageable',
  'Created',
];

export const roleTableColumns = ['ID', 'Name', 'Server Permissions', 'Admin Permissions', 'Created'];

export const serverTableColumns = ['ID', 'Status', 'Name', 'Node', 'Owner', 'Allocation', 'Created'];

export const serverMountTableColumns = ['ID', 'Name', 'Source', 'Target', 'Added', ''];

export const serverAllocationTableColumns = ['', 'IP', 'IP Alias', 'Port', 'Notes', 'Created', ''];

export const userTableColumns = (): string[] => {
  const { t } = getTranslations();
  return [
    '',
    t('common.table.columns.id', {}),
    t('common.table.columns.username', {}),
    t('pages.admin.users.table.columns.role', {}),
    t('common.table.columns.created', {}),
  ];
};

export const eggRepositoryEggTableColumns = ['', 'Path', 'Name', 'Author', 'Description', ''];

export const adminOAuthProviderUsersTableColumns = ['ID', 'User', 'Identifier', 'Last Used', 'Created'];

export const adminUserOAuthLinkTableColumns = (): string[] => {
  const { t } = getTranslations();
  return [
    t('common.table.columns.id', {}),
    t('pages.admin.users.tabs.oauthLinks.page.modal.add.form.oauthProvider', {}),
    t('common.form.identifier', {}),
    t('common.table.columns.lastUsed', {}),
    t('common.table.columns.created', {}),
    '',
  ];
};

export const adminActivityColumns = ['', 'Actor', 'Event', 'IP', 'When', ''];
