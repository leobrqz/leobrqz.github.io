'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { IconAlertCircle } from '@tabler/icons-react';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { t, type Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import { useProjects, type EnrichedProject } from '@/lib/use-projects';
import styles from './ProjectsPage.module.css';

export type ProjectsPageProps = {
  lang: Lang;
};

type ReadmeState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'html'; html: string }
  | { status: 'none' }
  | { status: 'error' };

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return iso;
  }
}

const PILL_CLASS = 'project-pill';

function SectionPills({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <Box component="ul" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {items.map((label) => (
        <Box
          key={label}
          component="li"
          className={PILL_CLASS}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 'var(--mantine-font-size-xs)',
            fontWeight: 500,
            backgroundColor: 'var(--mantine-color-dark-6)',
            color: 'var(--mantine-color-gray-3)',
            border: '1px solid var(--mantine-color-dark-4)',
          }}
        >
          {label}
        </Box>
      ))}
    </Box>
  );
}

function LanguagePills({ items }: { items: { name: string; percent: number }[] }) {
  if (items.length === 0) return null;
  return (
    <Box component="ul" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {items.map(({ name, percent }) => (
        <Box
          key={name}
          component="li"
          className={PILL_CLASS}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 'var(--mantine-font-size-xs)',
            fontWeight: 500,
            backgroundColor: 'var(--mantine-color-dark-6)',
            color: 'var(--mantine-color-gray-3)',
            border: '1px solid var(--mantine-color-dark-4)',
          }}
        >
          {name} {percent}%
        </Box>
      ))}
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
  const loading = readmeState.status === 'loading';
  const showContent =
    readmeState.status === 'html' ||
    readmeState.status === 'none' ||
    readmeState.status === 'error';

  const handleToggle = useCallback(() => {
    const expanding = !showContent;
    if (expanding) {
      trackEvent('readme_expand', { project: project.name });
    }
    onToggleReadme(project.name, expanding);
  }, [project.name, showContent, onToggleReadme]);

  const hasLanguages =
    project.languageBreakdown.length > 0 || project.languages.length > 0 || project.language;
  const hasLibsOrTools = project.libraries.length > 0 || project.tools.length > 0;
  const showRightColumn = hasLanguages || hasLibsOrTools;

  return (
    <Paper withBorder p="lg" radius="md" shadow="sm">
      <Stack gap="md">
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, sm: 7 }}>
            <Stack gap="xs">
              <Title order={3} size="h4">
                <Text
                  component="a"
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  inherit
                  c="var(--mantine-color-anchor)"
                  style={{ textDecoration: 'underline' }}
                  onClick={() => trackEvent('github_repo', { repo: project.name })}
                >
                  {project.name}
                </Text>
              </Title>
              {project.description && (
                <Text size="sm" c="dimmed">
                  {project.description}
                </Text>
              )}
              <Text size="xs" c="dimmed">
                {t(lang, 'projects.last_updated')}: {formatDate(project.updated_at)}
              </Text>
            </Stack>
          </Grid.Col>
          {showRightColumn && (
            <Grid.Col span={{ base: 12, sm: 5 }}>
              <Box
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${
                    (hasLanguages ? 1 : 0) +
                    (project.libraries.length > 0 ? 1 : 0) +
                    (project.tools.length > 0 ? 1 : 0)
                  }, 1fr)`,
                  gap: 'var(--mantine-spacing-lg)',
                  minHeight: 0,
                  paddingLeft: 'var(--mantine-spacing-sm)',
                  paddingRight: 'var(--mantine-spacing-md)',
                }}
              >
                {hasLanguages && (
                  <Stack gap="xs" style={{ minWidth: 0 }}>
                    <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {t(lang, 'projects.languages')}
                    </Text>
                    {project.languageBreakdown.length > 0 ? (
                      <LanguagePills items={project.languageBreakdown} />
                    ) : (
                      <SectionPills
                        items={
                          project.languages.length > 0
                            ? project.languages
                            : project.language
                              ? [project.language]
                              : []
                        }
                      />
                    )}
                  </Stack>
                )}
                {project.libraries.length > 0 && (
                  <Stack gap="xs" style={{ minWidth: 0 }}>
                    <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {t(lang, 'projects.libraries')}
                    </Text>
                    <SectionPills items={project.libraries} />
                  </Stack>
                )}
                {project.tools.length > 0 && (
                  <Stack gap="xs" style={{ minWidth: 0 }}>
                    <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {t(lang, 'projects.tools')}
                    </Text>
                    <SectionPills items={project.tools} />
                  </Stack>
                )}
              </Box>
            </Grid.Col>
          )}
        </Grid>

        <Button variant="light" size="xs" loading={loading} onClick={handleToggle}>
          {showContent ? t(lang, 'projects.hide_readme') : t(lang, 'projects.show_readme')}
        </Button>
        {showContent && (
          <Box
            component="div"
            style={{
              borderTop: '1px solid var(--mantine-color-default-border)',
              paddingTop: 'var(--mantine-spacing-md)',
              marginTop: 2,
            }}
          >
            {readmeState.status === 'html' && (
              <Box
                className={`${styles.readmeWrapper} markdown-body`}
                dangerouslySetInnerHTML={{ __html: readmeState.html }}
                style={{
                  borderRadius: 'var(--mantine-radius-sm)',
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
    </Paper>
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
    [fetchReadme]
  );

  if (state.status === 'loading') {
    return (
      <Box component="main" py="xl">
        <Container size="md">
          <Stack align="center" gap="md" py="xl">
            <Loader size="md" />
            <Text size="sm" c="dimmed">
              {t(lang, 'projects.last_updated')}…
            </Text>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (state.status === 'empty') {
    const message =
      state.kind === 'no_config' ? t(lang, 'projects.no_projects') : t(lang, 'projects.no_repos');
    return (
      <Box component="main" py="xl">
        <Container size="md">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title={t(lang, 'pages.projects')}
            color="gray"
          >
            <Text size="sm">{message}</Text>
          </Alert>
        </Container>
      </Box>
    );
  }

  if (state.status === 'error') {
    const errorMessage =
      state.kind === 'rate_limit' ? t(lang, 'projects.error_rate_limit') : t(lang, 'projects.error_loading');
    return (
      <Box component="main" py="xl">
        <Container size="md">
          <Alert icon={<IconAlertCircle size={16} />} title={t(lang, 'pages.projects')} color="red">
            {errorMessage}
          </Alert>
          <Button variant="light" mt="md" onClick={refetch}>
            Retry
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" py="xl">
      <Container size="md">
        <Stack
          gap="md"
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
          }}
        >
          <Title
            order={1}
            component={motion.h1}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
            }}
          >
            {t(lang, 'pages.projects')}
          </Title>
          {state.projects.map((project) => (
            <Box
              key={project.name}
              component={motion.div}
              variants={{
                hidden: { opacity: 0, x: 36 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
              }}
            >
              <ProjectCard
                project={project}
                lang={lang}
                readmeState={readmeOpen[project.name] ?? { status: 'idle' }}
                onToggleReadme={onToggleReadme}
              />
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
