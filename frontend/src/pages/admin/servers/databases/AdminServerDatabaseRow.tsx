import { z } from 'zod';
import Code from '@/elements/Code.tsx';
import TableLink from '@/elements/TableLink.tsx';
import { adminServerSchema, adminServerServerDatabaseSchema } from '@/lib/schemas/admin/servers.ts';
import DatabaseTableRow from '@/pages/admin/database-hosts/databases/DatabaseTableRow.tsx';

export default function AdminServerDatabaseRow({
  server,
  database,
}: {
  server: z.infer<typeof adminServerSchema>;
  database: z.infer<typeof adminServerServerDatabaseSchema>;
}) {
  return (
    <DatabaseTableRow
      database={database}
      serverUuid={server.uuid}
      hostUuid={database.databaseHost.uuid}
      linkColumn={
        <TableLink to={`/admin/database-hosts/${database.databaseHost.uuid}`}>
          <Code>{database.databaseHost.name}</Code>
        </TableLink>
      }
      registry={window.extensionContext.extensionRegistry.pages.admin.servers.view.databases.contextMenu}
      registryProps={{ server, database }}
    />
  );
}
