'use client';

import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { t, type Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import { useProjects, type EnrichedProject } from '@/lib/use-projects';
import { ProjectLabels } from './ProjectLabels';
import { BruteCard } from '@/components/BruteCard';
import { useThemeContext } from '@/components/ThemeProvider';
import styles from './ProjectsPage.module.css';

export type ProjectsPageProps = { lang: Lang };

type ReadmeState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'html'; html: string }
  | { status: 'none' }
  | { status: 'error' };

type FilterTag = 'ALL' | 'WEB' | 'AI' | 'DESKTOP' | 'AUTOMATION';

const FILTERS: FilterTag[] = ['ALL', 'WEB', 'AI', 'DESKTOP', 'AUTOMATION'];

const PROJECT_TAGS: Record<string, FilterTag[]> = {
  'TrackLyrics-ytdlp': ['DESKTOP', 'AUTOMATION'],
  'JobAppliesTracker': ['WEB'],
  'ShScriptHub': ['DESKTOP', 'AUTOMATION'],
  'AutoPot-DR': ['DESKTOP'],
  'SmokeShopERP-DataAnalytics': ['DESKTOP'],
  'MiniSchool': ['DESKTOP'],
  'Cheatsheet-LabAI': ['AI', 'WEB'],
  'myContracts-SpeedrunEthereum': ['WEB'],
};

function Pill({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        fontSize: 'var(--mantine-font-size-xs)',
        fontWeight: active ? 700 : 400,
        letterSpacing: '0.04em',
        border: '1px solid var(--mantine-color-dark-6)',
        backgroundColor: active ? 'var(--mantine-color-dark-8)' : 'transparent',
        color: active ? 'var(--mantine-primary-color-4)' : 'var(--mantine-color-dimmed)',
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </Box>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

function ProjectDossier({
  project,
  lang,
  readmeState,
  onToggleReadme,
}: {
  project: EnrichedProject;
  lang: Lang;
  readmeState: ReadmeState;
  onToggleReadme: (name: string, show: boolean) => void;
}) {
  const { theme } = useThemeContext();
  const isNerv = theme === 'nerv';
  const primaryColor = isNerv ? '#87FF5F' : '#D4790A';
  const readmeClass = `${styles.readmeWrapper} ${isNerv ? '' : styles.readmeLight} markdown-body`;
  const loading = readmeState.status === 'loading';
  const expanded =
    readmeState.status === 'html' ||
    readmeState.status === 'none' ||
    readmeState.status === 'error';

  const handleToggle = useCallback(() => {
    const expanding = !expanded;
    if (expanding) trackEvent('readme_expand', { project: project.name });
    onToggleReadme(project.name, expanding);
  }, [project.name, expanded, onToggleReadme]);

  const tags = PROJECT_TAGS[project.name] || [];
  const tagLabel = tags[0] || 'OTHER';

  return (
    <BruteCard style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack gap="xs" style={{ flex: 1 }}>
        <Group justify="space-between" wrap="nowrap">
          <Text size="xs" c="dimmed" style={{ letterSpacing: '0.05em' }}>
            [{tagLabel}]
          </Text>
          <ProjectLabels labels={project.labels} lang={lang} />
        </Group>
        <Text
          component="a"
          href={project.html_url}
          target="_blank"
          rel="noopener noreferrer"
          fw={700}
          size="sm"
          c={primaryColor}
          style={{ textDecoration: 'none', letterSpacing: '0.03em' }}
          onClick={() => trackEvent('github_repo', { repo: project.name })}
        >
          {project.name}
        </Text>
        {project.description && (
          <Text size="xs" c="dimmed" lineClamp={2}>
            {project.description}
          </Text>
        )}
        <Text size="xs" c="dimmed">
          {formatDate(project.updated_at)}
        </Text>
        <Box style={{ flex: 1 }} />
        <Button
          variant="outline"
          size="xs"
          loading={loading}
          onClick={handleToggle}
          color="dimmed"
          style={{ borderWidth: 1, alignSelf: 'flex-start' }}
        >
          {expanded ? t(lang, 'projects.hide_readme') : 'VIEW BRIEF'}
        </Button>
      </Stack>
      {expanded && (
        <Box
          mt="md"
          pt="md"
          style={{ borderTop: '1px solid var(--mantine-color-dark-6)' }}
        >
            {readmeState.status === 'html' && (
              <Box
                className={readmeClass}
              dangerouslySetInnerHTML={{ __html: readmeState.html }}
              style={{
                padding: 'var(--mantine-spacing-sm)',
                fontSize: 'var(--mantine-font-size-xs)',
                maxHeight: 360,
                overflow: 'auto',
              }}
            />
          )}
          {readmeState.status === 'none' && (
            <Text size="xs" c="dimmed">
              {t(lang, 'projects.no_readme')}
            </Text>
          )}
          {readmeState.status === 'error' && (
            <Text size="xs" c="red">
              {t(lang, 'projects.unable_to_load')}
            </Text>
          )}
        </Box>
      )}
    </BruteCard>
  );
}

export function ProjectsPage({ lang }: ProjectsPageProps) {
  const { state, refetch, fetchReadme } = useProjects();
  const [readmeOpen, setReadmeOpen] = useState<Record<string, ReadmeState>>({});
  const [filter, setFilter] = useState<FilterTag>('ALL');

  const onToggleReadme = useCallback(
    (name: string, show: boolean) => {
      if (!show) {
        setReadmeOpen((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
        return;
      }
      setReadmeOpen((prev) => ({ ...prev, [name]: { status: 'loading' } }));
      fetchReadme(name)
        .then((html) => {
          setReadmeOpen((prev) => ({
            ...prev,
            [name]: html ? { status: 'html', html } : { status: 'none' },
          }));
        })
        .catch(() => {
          setReadmeOpen((prev) => ({ ...prev, [name]: { status: 'error' } }));
        });
    },
    [fetchReadme],
  );

  const filteredProjects = useMemo(() => {
    if (state.status !== 'success') return [];
    if (filter === 'ALL') return state.projects;
    return state.projects.filter((p) => {
      const tags = PROJECT_TAGS[p.name] || [];
      return tags.includes(filter);
    });
  }, [state, filter]);

  if (state.status === 'loading') {
    return (
      <Box component="main" py="xl">
        <Container size="md">
          <Stack align="center" py="xl">
            <Loader size="sm" />
            <Text size="xs" c="dimmed" style={{ letterSpacing: '0.04em' }}>
              ACCESSING MISSION ARCHIVE...
            </Text>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (state.status === 'empty') {
    return (
      <Box component="main" py="xl">
        <Container size="md">
          <BruteCard>
            <Text size="xs" c="dimmed" style={{ letterSpacing: '0.04em' }}>
              NO MISSIONS ON FILE
            </Text>
          </BruteCard>
        </Container>
      </Box>
    );
  }

  if (state.status === 'error') {
    return (
      <Box component="main" py="xl">
        <Container size="md">
          <Stack gap="md">
            <BruteCard>
              <Text size="xs" c="red" style={{ letterSpacing: '0.04em' }}>
                ARCHIVE ACCESS DENIED
              </Text>
            </BruteCard>
            <Button variant="outline" size="xs" onClick={refetch} color="dimmed">
              RETRY
            </Button>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" py="xl">
      <Container size="md">
        <Stack gap="lg">
          {/* Archive header */}
          <Box
            style={{
              borderBottom: '1px solid var(--mantine-color-dark-6)',
              paddingBottom: 'var(--mantine-spacing-sm)',
            }}
          >
            <Text size="xs" c="dimmed" style={{ letterSpacing: '0.06em' }}>
              MISSION ARCHIVE {'//'} {state.projects.length} OPERATIONS LOGGED
            </Text>
          </Box>

          {/* Filter bar */}
          <Group gap={4} wrap="wrap">
            {FILTERS.map((f) => (
              <Pill
                key={f}
                label={f}
                active={filter === f}
                onClick={() => setFilter(f)}
              />
            ))}
          </Group>

          {/* Project grid */}
          {filteredProjects.length === 0 ? (
            <BruteCard>
              <Text size="xs" c="dimmed" style={{ letterSpacing: '0.04em' }}>
                NO MISSIONS MATCH FILTER [{filter}]
              </Text>
            </BruteCard>
          ) : (
            <motion.div
              key={filter}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                {filteredProjects.map((project, i) => (
                  <motion.div
                    key={project.name}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.3, delay: i * 0.03 },
                      },
                    }}
                  >
                    <ProjectDossier
                      project={project}
                      lang={lang}
                      readmeState={readmeOpen[project.name] ?? { status: 'idle' }}
                      onToggleReadme={onToggleReadme}
                    />
                  </motion.div>
                ))}
              </SimpleGrid>
            </motion.div>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
