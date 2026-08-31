import {
  faArrowDown,
  faArrowUp,
  faDiagramProject,
  faPlug,
  faStopwatch,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import { z } from 'zod';
import getNodeTunnelMetrics from '@/api/admin/nodes/tunnel/getNodeTunnelMetrics.ts';
import Badge from '@/elements/Badge.tsx';
import CopyOnClick from '@/elements/CopyOnClick.tsx';
import Group from '@/elements/Group.tsx';
import Stack from '@/elements/Stack.tsx';
import StatCard from '@/elements/StatCard.tsx';
import Table, { TableData, TableRow } from '@/elements/Table.tsx';
import Text from '@/elements/Text.tsx';
import TitleCard from '@/elements/TitleCard.tsx';
import Tooltip from '@/elements/Tooltip.tsx';
import { queryKeys } from '@/lib/queryKeys.ts';
import { adminNodeTunnelMetricsSchema, adminNodeTunnelPeerMetricsSchema } from '@/lib/schemas/admin/nodeTunnel.ts';
import { bytesToString } from '@/lib/size.ts';
import { formatMilliseconds } from '@/lib/time.ts';
import { useResource } from '@/plugins/useResource.ts';
import { useWebsocket } from '@/plugins/useWebsocket.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

type Peer = z.infer<typeof adminNodeTunnelPeerMetricsSchema>;

const DROP_REASONS = [
  'sendBufferFull',
  'unknownFlow',
  'fragTimeout',
  'fragLimit',
  'oversize',
  'malformed',
] as const satisfies (keyof Peer['drops'])[];

function PeerRow({ peer }: { peer: Peer }) {
  const { t } = useTranslations();

  const dropped = DROP_REASONS.reduce((total, reason) => total + peer.drops[reason], 0);
  const breakdown = DROP_REASONS.filter((reason) => peer.drops[reason] > 0)
    .map((reason) => `${t(`pages.admin.nodes.tabs.tunnel.page.metrics.drop.${reason}`, {})}: ${peer.drops[reason]}`)
    .join(', ');

  return (
    <TableRow>
      <TableData>
        <Stack gap={0}>
          <Text>{peer.name}</Text>
          <Text size='xs' c='dimmed'>
            {peer.uuid}
          </Text>
        </Stack>
      </TableData>
      <TableData>
        <Tooltip
          label={
            peer.role === 'initiator'
              ? t('pages.admin.nodes.tabs.tunnel.page.metrics.tooltip.roleInitiator', {})
              : t('pages.admin.nodes.tabs.tunnel.page.metrics.tooltip.roleAcceptor', {})
          }
        >
          <Badge variant='default' tt='none'>
            {peer.role === 'initiator'
              ? t('pages.admin.nodes.tabs.tunnel.page.metrics.role.initiator', {})
              : t('pages.admin.nodes.tabs.tunnel.page.metrics.role.acceptor', {})}
          </Badge>
        </Tooltip>
      </TableData>
      <TableData>
        <CopyOnClick content={peer.remoteAddr}>{peer.remoteAddr}</CopyOnClick>
      </TableData>
      <TableData>
        {t('pages.admin.nodes.tabs.tunnel.page.metrics.value.rtt', { rtt: peer.path.rttMs.toFixed(1) })}
      </TableData>
      <TableData>{peer.path.currentMtu}</TableData>
      <TableData>
        <Group gap='sm' wrap='nowrap'>
          <Text size='sm'>
            <FontAwesomeIcon icon={faArrowDown} size='xs' />{' '}
            {bytesToString(peer.relay.streamBytesIn + peer.relay.datagramBytesIn)}
          </Text>
          <Text size='sm'>
            <FontAwesomeIcon icon={faArrowUp} size='xs' />{' '}
            {bytesToString(peer.relay.streamBytesOut + peer.relay.datagramBytesOut)}
          </Text>
        </Group>
      </TableData>
      <TableData>
        {peer.relay.streamsOpen} / {peer.relay.streamsTotal}
      </TableData>
      <TableData>
        {peer.flows.open} / {peer.flows.openedTotal}
      </TableData>
      <TableData>
        {dropped === 0 ? (
          <Text c='dimmed'>0</Text>
        ) : (
          <Tooltip label={breakdown}>
            <Text c='red'>{dropped}</Text>
          </Tooltip>
        )}
      </TableData>
      <TableData>{formatMilliseconds(peer.establishedSecs * 1000)}</TableData>
    </TableRow>
  );
}

export default function AdminNodeTunnelMetrics({ nodeUuid }: { nodeUuid: string }) {
  const { t } = useTranslations();
  const { addToast } = useToast();

  const [live, setLive] = useState<z.infer<typeof adminNodeTunnelMetricsSchema> | null>(null);

  const { data: initial, error } = useResource({
    queryKey: queryKeys.admin.nodes.tunnelMetrics(nodeUuid),
    queryFn: () => getNodeTunnelMetrics(nodeUuid),
  });

  useWebsocket({
    path: `/api/admin/nodes/${nodeUuid}/tunnel/metrics/ws`,
    schema: adminNodeTunnelMetricsSchema,
    reconnectDelay: 5000,
    onMessage: setLive,
    onConnectionLost: () => {
      setLive(null);
      addToast(t('pages.admin.nodes.tabs.tunnel.page.toast.connectionLost', {}), 'error');
    },
  });

  const data = live ?? initial;

  if (!data) {
    return (
      <TitleCard title={t('pages.admin.nodes.tabs.tunnel.page.metrics.title', {})}>
        <Text c='dimmed' size='sm'>
          {error
            ? t('pages.admin.nodes.tabs.tunnel.page.metrics.unreachable', {})
            : t('pages.admin.nodes.tabs.tunnel.page.metrics.loading', {})}
        </Text>
      </TitleCard>
    );
  }

  return (
    <Stack>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <StatCard
          icon={faDiagramProject}
          label={t('pages.admin.nodes.tabs.tunnel.page.metrics.stat.peers', {})}
          value={String(data.node.peersConnected)}
        />
        <StatCard
          icon={faStopwatch}
          label={t('pages.admin.nodes.tabs.tunnel.page.metrics.stat.uptime', {})}
          value={formatMilliseconds(data.node.uptimeSecs * 1000)}
        />
        <StatCard
          icon={faPlug}
          label={t('pages.admin.nodes.tabs.tunnel.page.metrics.stat.frontends', {})}
          value={String(data.node.frontends)}
          details={t('pages.admin.nodes.tabs.tunnel.page.metrics.stat.flowsOpen', { count: data.node.localFlowsOpen })}
        />
        <StatCard
          icon={faTrash}
          label={t('pages.admin.nodes.tabs.tunnel.page.metrics.stat.localDrops', {})}
          value={String(data.node.localDrops)}
          details={t('pages.admin.nodes.tabs.tunnel.page.metrics.stat.frozenFlows', { count: data.node.frozenFlows })}
        />
      </SimpleGrid>

      <TitleCard
        title={t('pages.admin.nodes.tabs.tunnel.page.metrics.title', {})}
        rightSection={
          <Text size='xs' c='dimmed' ml='auto'>
            {t('pages.admin.nodes.tabs.tunnel.page.metrics.applied', {
              epoch: data.node.epoch,
              snapshots: data.node.snapshotsApplied,
            })}
          </Text>
        }
        wrapperClassName='p-0!'
      >
        <Table
          flush
          columns={[
            t('pages.admin.nodes.tabs.tunnel.page.metrics.column.peer', {}),
            t('pages.admin.nodes.tabs.tunnel.page.metrics.column.role', {}),
            t('pages.admin.nodes.tabs.tunnel.page.metrics.column.address', {}),
            t('pages.admin.nodes.tabs.tunnel.page.metrics.column.rtt', {}),
            t('pages.admin.nodes.tabs.tunnel.page.metrics.column.mtu', {}),
            t('pages.admin.nodes.tabs.tunnel.page.metrics.column.transferred', {}),
            t('pages.admin.nodes.tabs.tunnel.page.metrics.column.streams', {}),
            t('pages.admin.nodes.tabs.tunnel.page.metrics.column.flows', {}),
            t('pages.admin.nodes.tabs.tunnel.page.metrics.column.drops', {}),
            t('pages.admin.nodes.tabs.tunnel.page.metrics.column.connected', {}),
          ]}
          pagination={{ total: data.peers.length, perPage: data.peers.length, page: 1, data: data.peers }}
        >
          {data.peers.map((peer) => (
            <PeerRow key={peer.uuid} peer={peer} />
          ))}
        </Table>
      </TitleCard>
    </Stack>
  );
}
