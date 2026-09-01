import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import createDatabaseAgentHost from '@/api/admin/database-agent-hosts/createDatabaseAgentHost.ts';
import deleteDatabaseAgentHost from '@/api/admin/database-agent-hosts/deleteDatabaseAgentHost.ts';
import resetDatabaseAgentHostToken from '@/api/admin/database-agent-hosts/resetDatabaseAgentHostToken.ts';
import testDatabaseAgentHost from '@/api/admin/database-agent-hosts/testDatabaseAgentHost.ts';
import updateDatabaseAgentHost from '@/api/admin/database-agent-hosts/updateDatabaseAgentHost.ts';
import Button from '@/elements/Button.tsx';
import { AdminCan } from '@/elements/Can.tsx';
import AdminContentContainer from '@/elements/containers/AdminContentContainer.tsx';
import { type FieldDef, FormEngine, useFormEngine } from '@/elements/form-engine/index.ts';
import Group from '@/elements/Group.tsx';
import TextInput from '@/elements/input/TextInput.tsx';
import ForceDeleteModal from '@/elements/modals/ForceDeleteModal.tsx';
import UrlMissingPortAlert from '@/elements/UrlMissingPortAlert.tsx';
import { DATABASE_AGENT_DEFAULT_PORT } from '@/lib/databaseAgentHost.ts';
import { databaseAgentTypeDefaultPortMapping, databaseAgentTypeLabelMapping } from '@/lib/enums.ts';
import { queryKeys } from '@/lib/queryKeys.ts';
import {
  adminDatabaseAgentHostCreateSchema,
  adminDatabaseAgentHostSchema,
  adminDatabaseAgentHostUpdateSchema,
} from '@/lib/schemas/admin/databaseAgentHosts.ts';
import { getUrlConnectPort, withUrlPort } from '@/lib/url.ts';
import { useHostAction } from '@/plugins/useHostAction.ts';
import { useResourceForm } from '@/plugins/useResourceForm.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { databaseAgentHostEmptyFormValues, databaseAgentHostToFormValues } from './databaseAgentHostFormValues.ts';

type DatabaseAgentHostFormValues = z.infer<typeof adminDatabaseAgentHostUpdateSchema>;
type DatabaseAgentTypeKey = keyof typeof databaseAgentTypeLabelMapping;

export default function DatabaseAgentHostCreateOrUpdate({
  contextDatabaseAgentHost,
}: {
  contextDatabaseAgentHost?: z.infer<typeof adminDatabaseAgentHostSchema>;
}) {
  const { t } = useTranslations();
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState<'delete' | null>(null);
  const [deleteDoForce, setDeleteDoForce] = useState(false);

  const form = useFormEngine<DatabaseAgentHostFormValues>('admin.databaseAgentHosts.createOrUpdate', {
    schema: (contextDatabaseAgentHost
      ? adminDatabaseAgentHostUpdateSchema
      : adminDatabaseAgentHostCreateSchema
    ).unwrap(),
    initialValues: databaseAgentHostEmptyFormValues,
    validateInputOnBlur: true,
  });

  const { loading, setLoading, doCreateOrUpdate, doDelete } = useResourceForm<
    DatabaseAgentHostFormValues,
    z.infer<typeof adminDatabaseAgentHostSchema>
  >({
    form,
    createFn: () => createDatabaseAgentHost(adminDatabaseAgentHostCreateSchema.parse(form.getValues())),
    updateFn: contextDatabaseAgentHost
      ? () =>
          updateDatabaseAgentHost(
            contextDatabaseAgentHost.uuid,
            adminDatabaseAgentHostUpdateSchema.parse(form.getValues()),
          )
      : undefined,
    deleteFn: contextDatabaseAgentHost
      ? () => deleteDatabaseAgentHost(contextDatabaseAgentHost.uuid, { force: deleteDoForce })
      : undefined,
    doUpdate: !!contextDatabaseAgentHost,
    basePath: '/admin/database-agent-hosts',
    resourceName: t('pages.admin.databaseAgentHosts.resourceName', {}),
  });

  useEffect(() => {
    if (contextDatabaseAgentHost) {
      form.setValues(databaseAgentHostToFormValues(contextDatabaseAgentHost));
    }
  }, [contextDatabaseAgentHost]);

  const runHostAction = useHostAction(contextDatabaseAgentHost?.uuid, setLoading);

  const doResetToken = () =>
    runHostAction(
      resetDatabaseAgentHostToken,
      t('pages.admin.databaseAgentHosts.tabs.general.page.toast.tokenReset', {}),
      () =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.databaseAgentHosts.token(contextDatabaseAgentHost!.uuid),
        }),
    );

  const doTest = () =>
    runHostAction(testDatabaseAgentHost, t('pages.admin.databaseAgentHosts.tabs.general.page.toast.tested', {}));

  const urlValue = form.getValues().url ?? '';
  const typeEnabled = (type: string) => (values: DatabaseAgentHostFormValues) =>
    values.types?.[type as DatabaseAgentTypeKey]?.enabled !== false;

  const fields: FieldDef<DatabaseAgentHostFormValues>[] = [
    { type: 'text', name: 'name', label: t('common.form.name', {}), required: true },
    {
      type: 'custom',
      name: 'url',
      render: (f) => (
        <div className='flex flex-col gap-2'>
          <TextInput
            withAsterisk
            label={t('common.form.url', {})}
            placeholder='https://agent.example.com:8090'
            key={f.key('url')}
            {...f.getInputProps('url')}
          />
          <UrlMissingPortAlert
            url={urlValue}
            defaultPort={DATABASE_AGENT_DEFAULT_PORT}
            onAddPort={() => f.setFieldValue('url', withUrlPort(urlValue, DATABASE_AGENT_DEFAULT_PORT))}
          >
            {t('pages.admin.databaseAgentHosts.tabs.general.page.alert.urlMissingPort', {
              port: String(getUrlConnectPort(urlValue) ?? 443),
              agentPort: String(DATABASE_AGENT_DEFAULT_PORT),
            }).md()}
          </UrlMissingPortAlert>
        </div>
      ),
    },
    { type: 'textarea', name: 'description', label: t('common.form.description', {}), colSpan: 'full' },
    { type: 'size', name: 'memory', label: t('common.form.memory', {}), required: true, mode: 'mb', min: 1 },
    { type: 'size', name: 'disk', label: t('common.form.disk', {}), required: true, mode: 'mb', min: 1 },
    { type: 'switch', name: 'deploymentEnabled', label: t('common.form.deploymentEnabled', {}) },
    { type: 'switch', name: 'maintenanceEnabled', label: t('common.form.maintenanceEnabled', {}) },
    ...Object.entries(databaseAgentTypeLabelMapping).flatMap(
      ([type, label]): FieldDef<DatabaseAgentHostFormValues>[] => [
        {
          type: 'divider',
          name: `types.${type}.divider`,
          label,
          switchName: `types.${type}.enabled`,
          switchLabel: t('common.form.enabled', {}),
        },
        {
          type: 'text',
          name: `types.${type}.publicHost`,
          label: t('pages.admin.databaseAgentHosts.tabs.general.page.form.typePublicHost', {}),
          when: typeEnabled(type),
        },
        {
          type: 'number',
          name: `types.${type}.publicPort`,
          label: t('pages.admin.databaseAgentHosts.tabs.general.page.form.typePublicPort', {}),
          props: {
            min: 1,
            max: 65535,
            placeholder: String(
              databaseAgentTypeDefaultPortMapping[type as keyof typeof databaseAgentTypeDefaultPortMapping],
            ),
          },
          when: typeEnabled(type),
        },
      ],
    ),
  ];

  return (
    <AdminContentContainer
      title={
        contextDatabaseAgentHost
          ? t('pages.admin.databaseAgentHosts.tabs.general.page.titleUpdate', {})
          : t('pages.admin.databaseAgentHosts.tabs.general.page.titleCreate', {})
      }
      fullscreen={!!contextDatabaseAgentHost}
      titleOrder={2}
    >
      <ForceDeleteModal
        opened={openModal === 'delete'}
        onClose={() => setOpenModal(null)}
        title={t('pages.admin.databaseAgentHosts.tabs.general.page.modal.delete.title', {})}
        name={form.getValues().name ?? ''}
        force={deleteDoForce}
        onForceChange={setDeleteDoForce}
        forceWarning={t('pages.admin.databaseAgentHosts.tabs.general.page.modal.delete.alert.forceWarning', {})}
        onConfirmed={doDelete}
      />

      <form onSubmit={form.onSubmit(() => doCreateOrUpdate(false, queryKeys.admin.databaseAgentHosts.all()))}>
        <FormEngine form={form} fields={fields} />

        <Group mt='md'>
          <AdminCan
            action={contextDatabaseAgentHost ? 'database-agent-hosts.update' : 'database-agent-hosts.create'}
            cantSave
          >
            <Button type='submit' disabled={!form.isValid()} loading={loading}>
              {t('common.button.save', {})}
            </Button>
            {!contextDatabaseAgentHost && (
              <Button
                onClick={() => doCreateOrUpdate(true, queryKeys.admin.databaseAgentHosts.all())}
                disabled={!form.isValid()}
                loading={loading}
              >
                {t('common.button.saveAndStay', {})}
              </Button>
            )}
          </AdminCan>
          {contextDatabaseAgentHost && (
            <>
              <AdminCan action='database-agent-hosts.test'>
                <Button variant='outline' onClick={doTest} loading={loading}>
                  {t('pages.admin.databaseAgentHosts.tabs.general.page.button.testConnection', {})}
                </Button>
              </AdminCan>
              <AdminCan action='database-agent-hosts.reset-token'>
                <Button variant='outline' color='red' onClick={doResetToken} loading={loading}>
                  {t('pages.admin.databaseAgentHosts.tabs.general.page.button.resetToken', {})}
                </Button>
              </AdminCan>
              <AdminCan action='database-agent-hosts.delete' cantDelete>
                <Button color='red' onClick={() => setOpenModal('delete')} loading={loading}>
                  {t('common.button.delete', {})}
                </Button>
              </AdminCan>
            </>
          )}
        </Group>
      </form>
    </AdminContentContainer>
  );
}
