'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { IconAlertCircle, IconArrowUpRight, IconRefresh } from '@tabler/icons-react';
import { Anchor, Box, Container, Text } from '@mantine/core';
import { getFallbackProjects } from '@/data/project_fallback';
import { trackEvent } from '@/lib/analytics';
import { t, type Lang } from '@/lib/i18n';
import { useProjects, type EnrichedProject } from '@/lib/use-projects';
import { ProjectLabels } from './ProjectLabels';
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
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <ul className={styles.tagList}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function DetailGroup({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <div className={styles.detailGroup}>
      <span className={styles.detailLabel}>{label}</span>
      <TagList items={items} />
    </div>
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
  const showContent = readmeState.status !== 'idle' && readmeState.status !== 'loading';
  const date = formatDate(project.updated_at);
  const languageItems =
    project.languageBreakdown.length > 0
      ? project.languageBreakdown.map(({ name }) => name)
      : project.languages.length > 0
        ? project.languages
        : project.language
          ? [project.language]
          : [];

  const handleToggle = () => {
    const expanding = !showContent;
    if (expanding) {
      trackEvent('readme_expand', { project: project.name });
    }
    onToggleReadme(project.name, expanding);
  };

  return (
    <article className={styles.projectCard}>
      <span className={styles.timelinePoint} aria-hidden="true" />
      <div className={styles.projectCardHeader}>
        <div className={styles.projectIdentity}>
          <div>
            <div className={styles.projectTitleLine}>
              <Anchor
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectTitle}
                onClick={() => trackEvent('github_repo', { repo: project.name })}
              >
                {project.name} <IconArrowUpRight size={17} />
              </Anchor>
              <ProjectLabels labels={project.labels} lang={lang} />
            </div>
            {project.description && (
              <p className={styles.projectDescription}>{project.description}</p>
            )}
            <div className={styles.projectMeta}>
              {date && (
                <span>
                  {t(lang, 'projects.last_updated')}: {date}
                </span>
              )}
              <span>github.com / {project.name}</span>
            </div>
          </div>
        </div>

        <div className={styles.projectDetails}>
          <DetailGroup label={t(lang, 'projects.languages')} items={languageItems} />
          <DetailGroup label={t(lang, 'projects.libraries')} items={project.libraries} />
          <DetailGroup label={t(lang, 'projects.tools')} items={project.tools} />
        </div>
      </div>

      <button
        type="button"
        className={styles.readmeButton}
        onClick={handleToggle}
        disabled={readmeState.status === 'loading'}
      >
        <span>
          {readmeState.status === 'loading'
            ? 'Loading…'
            : showContent
              ? t(lang, 'projects.hide_readme')
              : t(lang, 'projects.show_readme')}
        </span>
        <IconArrowUpRight size={16} className={showContent ? styles.rotateIcon : ''} />
      </button>

      {showContent && (
        <div className={styles.readmePanel}>
          {readmeState.status === 'html' && (
            <Box
              className={`${styles.readmeWrapper} markdown-body`}
              dangerouslySetInnerHTML={{ __html: readmeState.html }}
            />
          )}
          {readmeState.status === 'none' && (
            <Text className={styles.readmeEmpty}>{t(lang, 'projects.no_readme')}</Text>
          )}
          {readmeState.status === 'error' && (
            <Text className={styles.readmeError}>{t(lang, 'projects.unable_to_load')}</Text>
          )}
        </div>
      )}
    </article>
  );
}

export function ProjectsPage({ lang }: ProjectsPageProps) {
  const { state, refetch, fetchReadme } = useProjects();
  const [readmeOpen, setReadmeOpen] = useState<Record<string, ReadmeState>>({});
  const fallbackProjects = useMemo(() => getFallbackProjects(lang), [lang]);
  const projects =
    state.status === 'success' && state.projects.length > 0 ? state.projects : fallbackProjects;

  const onToggleReadme = useCallback(
    (name: string, show: boolean) => {
      if (!show) {
        setReadmeOpen((previous) => {
          const next = { ...previous };
          delete next[name];
          return next;
        });
        return;
      }
      setReadmeOpen((previous) => ({ ...previous, [name]: { status: 'loading' } }));
      fetchReadme(name)
        .then((html) => {
          setReadmeOpen((previous) => ({
            ...previous,
            [name]: html ? { status: 'html', html } : { status: 'none' },
          }));
        })
        .catch(() => {
          setReadmeOpen((previous) => ({ ...previous, [name]: { status: 'error' } }));
        });
    },
    [fetchReadme]
  );

  return (
    <Box component="main" className={styles.projectsPage}>
      <Container size="lg" className={styles.projectsContainer}>
        <header className={styles.pageIntro}>
          <span className={styles.eyebrow}>PROJECTS / GITHUB</span>
          <h1>{t(lang, 'pages.projects')}</h1>
          <p>
            {lang === 'en'
              ? 'Published and ongoing work — with the code, context and stack in view.'
              : 'Projetos publicados e em andamento — com código, contexto e stack à vista.'}
          </p>
        </header>

        {state.status === 'loading' && (
          <div className={styles.syncNotice}>
            <span className={styles.syncDot} />
            {lang === 'en'
              ? 'Showing selected projects while GitHub syncs.'
              : 'Exibindo projetos selecionados enquanto o GitHub sincroniza.'}
          </div>
        )}
        {state.status === 'error' && (
          <div className={styles.syncNotice} role="status">
            <IconAlertCircle size={17} />
            <span>
              {state.kind === 'rate_limit'
                ? t(lang, 'projects.error_rate_limit')
                : t(lang, 'projects.error_loading')}
            </span>
            <button type="button" className={styles.retryButton} onClick={refetch}>
              <IconRefresh size={15} /> Retry
            </button>
          </div>
        )}
        {state.status === 'empty' && (
          <div className={styles.syncNotice} role="status">
            <IconAlertCircle size={17} />
            <span>
              {state.kind === 'no_config'
                ? t(lang, 'projects.no_projects')
                : t(lang, 'projects.no_repos')}
            </span>
          </div>
        )}

        <div className={styles.projectList}>
          {projects.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
              lang={lang}
              readmeState={readmeOpen[project.name] ?? { status: 'idle' }}
              onToggleReadme={onToggleReadme}
            />
          ))}
        </div>

        <Anchor
          component={Link}
          href={lang === 'en' ? '/en' : '/'}
          className={styles.backLink}
          underline="never"
        >
          ← {lang === 'en' ? 'Back home' : 'Voltar ao início'}
        </Anchor>
      </Container>
    </Box>
  );
}
