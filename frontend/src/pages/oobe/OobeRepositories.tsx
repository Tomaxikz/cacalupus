import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { z } from 'zod';
import createEggRepository from '@/api/admin/egg-repositories/createEggRepository.ts';
import syncEggRepository from '@/api/admin/egg-repositories/syncEggRepository.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import AlertError from '@/elements/alerts/AlertError.tsx';
import Button from '@/elements/Button.tsx';
import Checkbox from '@/elements/input/Checkbox.tsx';
import { adminEggRepositoryUpdateSchema } from '@/lib/schemas/admin/eggRepositories.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { OobeComponentProps } from '@/routers/OobeRouter.tsx';

export default function OobeRepositories({ onNext, skipFrom }: OobeComponentProps) {
  const { t } = useTranslations();

  const repositories: z.infer<typeof adminEggRepositoryUpdateSchema>[] = [
    {
      name: t('pages.oobe.eggRepositories.repositories.pterodactylGame.title', {}),
      description: t('pages.oobe.eggRepositories.repositories.pterodactylGame.description', {}),
      gitRepository: 'https://github.com/pterodactyl/game-eggs',
    },
    {
      name: t('pages.oobe.eggRepositories.repositories.pterodactylGame.title', {}),
      description: t('pages.oobe.eggRepositories.repositories.pterodactylGame.description', {}),
      gitRepository: 'https://github.com/pterodactyl/application-eggs',
    },
    {
      name: t('pages.oobe.eggRepositories.repositories.pterodactylGame.title', {}),
      description: t('pages.oobe.eggRepositories.repositories.pterodactylGame.description', {}),
      gitRepository: 'https://github.com/pterodactyl/generic-eggs',
    },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);

  const toggleRepo = (gitRepository: string) => {
    setSelectedRepos((prev) =>
      prev.includes(gitRepository) ? prev.filter((r) => r !== gitRepository) : [...prev, gitRepository],
    );
  };

  const onSubmit = async () => {
    setLoading(true);

    try {
      const promises = selectedRepos.map(async (selected) => {
        const repo = repositories.find((r) => r.gitRepository === selected);

        if (!repo) return;

        const repository = await createEggRepository(repo);
        await syncEggRepository(repository.uuid);
      });

      await Promise.all(promises);

      onNext();
    } catch (msg) {
      setError(httpErrorToHuman(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap='lg'>
      <Title order={2}>{t('pages.oobe.eggRepositories.title', {})}</Title>

      {error && <AlertError error={error} setError={setError} />}

      <Stack gap='xl'>
        <Stack gap='sm'>
          <Text size='sm'>{t('pages.oobe.eggRepositories.description', {})}</Text>
          {repositories.map((repo) => {
            const isSelected = selectedRepos.includes(repo.gitRepository);
            return (
              <Paper
                key={repo.gitRepository}
                withBorder
                p='md'
                radius='md'
                onClick={() => toggleRepo(repo.gitRepository)}
                style={{ cursor: 'pointer', borderColor: isSelected ? 'var(--mantine-color-blue-5)' : undefined }}
              >
                <div className='flex items-start gap-3'>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleRepo(repo.gitRepository)}
                    onClick={(e) => e.stopPropagation()}
                    mt={2}
                  />
                  <div className='flex flex-col gap-0.5'>
                    <Text fw={600} size='sm'>
                      {repo.name}
                    </Text>
                    <Text size='xs' c='dimmed'>
                      {repo.description}
                    </Text>
                    <Text size='xs' c='blue' mt={4}>
                      {repo.gitRepository}
                    </Text>
                  </div>
                </div>
              </Paper>
            );
          })}
        </Stack>

        <Group justify='flex-end'>
          <Button variant='outline' onClick={() => skipFrom('repositories')}>
            {t('common.button.skip', {})}
          </Button>
          <Button type='submit' disabled={!(selectedRepos.length > 0)} loading={loading} onClick={() => onSubmit()}>
            {t('pages.oobe.eggRepositories.button.submit', {})}
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
}
