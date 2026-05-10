'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Button, Container, Loader, Stack, Text } from '@mantine/core';
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

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

function Pill({ label }: { label: string }) {
  return (
    <Box
      component="span"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        fontSize: 'var(--mantine-font-size-xs)',
        fontWeight: 500,
        border: '1px solid var(--mantine-color-dark-4)',
      }}
    >
      {label}
    </Box>
  );
}

function ProjectCard({
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
  const primaryShade = isNerv ? 'evaGreen.4' : 'lclRust.5';
  const loading = readmeState.status === 'loading';
  const showContent =
    readmeState.status === 'html' ||
    readmeState.status === 'none' ||
    readmeState.status === 'error';

  const handleToggle = useCallback(() => {
    const expanding = !showContent;
    if (expanding) trackEvent('readme_expand', { project: project.name });
    onToggleReadme(project.name, expanding);
  }, [project.name, showContent, onToggleReadme]);

  const hasLanguages =
    project.languageBreakdown.length > 0 || project.languages.length > 0 || project.language;
  const languages =
    project.languageBreakdown.length > 0
      ? project.languageBreakdown.map((l) => l.name)
      : project.languages.length > 0
        ? project.languages
        : project.language
          ? [project.language]
          : [];

  return (
    <BruteCard>
      <Stack gap="md">
        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <Text
            component="a"
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            fw={700}
            size="sm"
            c={primaryShade}
            style={{ textDecoration: 'none' }}
            onClick={() => trackEvent('github_repo', { repo: project.name })}
          >
            {project.name}
          </Text>
          <ProjectLabels labels={project.labels} lang={lang} />
        </Box>
        {project.description && (
          <Text size="xs" c="dimmed" lineClamp={2}>
            {project.description}
          </Text>
        )}
        <Text size="xs" c="dimmed">
          {t(lang, 'projects.last_updated')}: {formatDate(project.updated_at)}
        </Text>

        {hasLanguages && (
          <Stack gap={4}>
            <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.06em' }}>
              {t(lang, 'projects.languages').toUpperCase()}
            </Text>
            <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {languages.map((name) => (
                <Pill key={name} label={name} />
              ))}
            </Box>
          </Stack>
        )}

        {project.libraries.length > 0 && (
          <Stack gap={4}>
            <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.06em' }}>
              {t(lang, 'projects.libraries').toUpperCase()}
            </Text>
            <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {project.libraries.map((lib) => (
                <Pill key={lib} label={lib} />
              ))}
            </Box>
          </Stack>
        )}

        {project.tools.length > 0 && (
          <Stack gap={4}>
            <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.06em' }}>
              {t(lang, 'projects.tools').toUpperCase()}
            </Text>
            <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {project.tools.map((tool) => (
                <Pill key={tool} label={tool} />
              ))}
            </Box>
          </Stack>
        )}

        <Button
          variant="outline"
          size="xs"
          loading={loading}
          onClick={handleToggle}
          color="dimmed"
          style={{ borderWidth: 1 }}
        >
          {showContent ? t(lang, 'projects.hide_readme') : t(lang, 'projects.show_readme')}
        </Button>

        {showContent && (
          <Box
            style={{
              borderTop: '1px solid var(--mantine-color-dark-6)',
              paddingTop: 'var(--mantine-spacing-md)',
            }}
          >
            {readmeState.status === 'html' && (
              <Box
                className={`${styles.readmeWrapper} markdown-body`}
                dangerouslySetInnerHTML={{ __html: readmeState.html }}
                style={{
                  padding: 'var(--mantine-spacing-md)',
                  fontSize: 'var(--mantine-font-size-sm)',
                  overflow: 'auto',
                }}
              />
            )}
            {readmeState.status === 'none' && (
              <Text size="sm" c="dimmed">
                {t(lang, 'projects.no_readme')}
              </Text>
            )}
            {readmeState.status === 'error' && (
              <Text size="sm" c="red">
                {t(lang, 'projects.unable_to_load')}
              </Text>
            )}
          </Box>
        )}
      </Stack>
    </BruteCard>
  );
}

export function ProjectsPage({ lang }: ProjectsPageProps) {
  const { state, refetch, fetchReadme } = useProjects();
  const [readmeOpen, setReadmeOpen] = useState<Record<string, ReadmeState>>({});

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

  if (state.status === 'loading') {
    return (
      <Box component="main" py="xl">
        <Container size="md">
          <Stack align="center" gap="md" py="xl">
            <Loader size="md" />
            <Text size="sm" c="dimmed">
              fetching repos...
            </Text>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (state.status === 'empty') {
    const message =
      state.kind === 'no_config'
        ? t(lang, 'projects.no_projects')
        : t(lang, 'projects.no_repos');
    return (
      <Box component="main" py="xl">
        <Container size="md">
          <BruteCard>
            <Text size="sm" c="dimmed">
              {message}
            </Text>
          </BruteCard>
        </Container>
      </Box>
    );
  }

  if (state.status === 'error') {
    const errorMessage =
      state.kind === 'rate_limit'
        ? t(lang, 'projects.error_rate_limit')
        : t(lang, 'projects.error_loading');
    return (
      <Box component="main" py="xl">
        <Container size="md">
          <Stack gap="md">
            <BruteCard>
              <Text size="sm" c="red">
                error: {errorMessage}
              </Text>
            </BruteCard>
            <Button variant="outline" size="xs" onClick={refetch} color="dimmed">
              retry
            </Button>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" py="xl">
      <Container size="md">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
          }}
        >
          <Stack gap="md">
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
              }}
            >
              <Text size="sm" c="dimmed" fw={600} style={{ letterSpacing: '0.06em' }}>
                {t(lang, 'pages.projects').toLowerCase()}
              </Text>
            </motion.div>
            {state.projects.map((project) => (
              <motion.div
                key={project.name}
                variants={{
                  hidden: { opacity: 0, x: 24 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                }}
              >
                <ProjectCard
                  project={project}
                  lang={lang}
                  readmeState={readmeOpen[project.name] ?? { status: 'idle' }}
                  onToggleReadme={onToggleReadme}
                />
              </motion.div>
            ))}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
