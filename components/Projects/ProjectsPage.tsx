'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { IconAlertCircle, IconArrowUpRight, IconRefresh } from '@tabler/icons-react';
import { Anchor, Box, Container } from '@mantine/core';
import { Reveal } from '@/components/Design/Reveal';
import { getFallbackProjects } from '@/data/project_fallback';
import { trackEvent } from '@/lib/analytics';
import { t, type Lang } from '@/lib/i18n';
import { useProjects } from '@/lib/use-projects';
import { ProjectActions } from './ProjectActions';
import { ProjectLabels } from './ProjectLabels';
import { ProjectReadme } from './ProjectReadme';
import styles from './ProjectsPage.module.css';

export type ProjectsPageProps = { lang: Lang };
type ReadmeState =
  { status: 'idle' | 'loading' | 'none' | 'error' } | { status: 'html'; html: string };

function formatDate(iso: string, lang: Lang): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR');
}

export function ProjectsPage({ lang }: ProjectsPageProps) {
  const { state, refetch, fetchReadme } = useProjects(lang);
  const [readmeOpen, setReadmeOpen] = useState<Record<string, ReadmeState>>({});
  const [activeHash, setActiveHash] = useState('');
  const handledHashes = useRef(new Set<string>());
  const pendingScrollProject = useRef<string | null>(null);
  const fallbackProjects = useMemo(() => getFallbackProjects(lang), [lang]);
  const projects =
    state.status === 'success' && state.projects.length ? state.projects : fallbackProjects;

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
      trackEvent('readme_expand', { project: name });
      fetchReadme(name)
        .then((html) =>
          setReadmeOpen((previous) => ({
            ...previous,
            [name]: html ? { status: 'html', html } : { status: 'none' },
          }))
        )
        .catch(() => setReadmeOpen((previous) => ({ ...previous, [name]: { status: 'error' } })));
    },
    [fetchReadme]
  );

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      try {
        setActiveHash(decodeURIComponent(hash));
      } catch {
        setActiveHash(hash);
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  useEffect(() => {
    if (!activeHash || handledHashes.current.has(activeHash)) {
      return;
    }
    const project = projects.find(({ name }) => `project-${name}` === activeHash);
    if (!project) {
      return;
    }

    handledHashes.current.add(activeHash);
    pendingScrollProject.current = project.name;
    if (!readmeOpen[project.name] || readmeOpen[project.name].status === 'idle') {
      onToggleReadme(project.name, true);
    }
  }, [activeHash, onToggleReadme, projects, readmeOpen]);

  useEffect(() => {
    const projectName = pendingScrollProject.current;
    const readme = projectName ? readmeOpen[projectName] : undefined;
    if (!projectName || !readme || readme.status === 'loading' || readme.status === 'idle') {
      return;
    }

    pendingScrollProject.current = null;
    window.requestAnimationFrame(() => {
      const row = document.getElementById(`project-${projectName}`);
      row?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }, [readmeOpen]);

  return (
    <Box component="main" className={styles.projectsPage}>
      <Container className={styles.projectsContainer}>
        <header className={styles.pageIntro}>
          <span className={styles.eyebrow}>{lang === 'en' ? 'PROJECTS' : 'PROJETOS'}</span>
          <h1>{t(lang, 'pages.projects')}</h1>
        </header>

        {state.status === 'loading' && (
          <div className={styles.syncNotice} role="status">
            <span className={styles.syncDot} />
            {lang === 'en'
              ? 'Showing selected projects while GitHub loads.'
              : 'Exibindo projetos selecionados enquanto o GitHub carrega.'}
          </div>
        )}
        {state.status === 'error' && (
          <div className={styles.syncNotice} role="status">
            <IconAlertCircle size={16} />
            <span>
              {state.kind === 'rate_limit'
                ? t(lang, 'projects.error_rate_limit')
                : t(lang, 'projects.error_loading')}
            </span>
            <button type="button" className={styles.retryButton} onClick={refetch}>
              <IconRefresh size={15} />
              {lang === 'en' ? 'Retry' : 'Tentar novamente'}
            </button>
          </div>
        )}
        {state.status === 'empty' && (
          <div className={styles.syncNotice} role="status">
            <IconAlertCircle size={16} />
            <span>
              {state.kind === 'no_config'
                ? t(lang, 'projects.no_projects')
                : t(lang, 'projects.no_repos')}
            </span>
          </div>
        )}

        <div className={styles.listHeading}>
          <span>{lang === 'en' ? 'REPOSITORIES' : 'REPOSITÓRIOS'}</span>
        </div>
        <div className={styles.projectList}>
          {projects.map((project, index) => {
            const readme = readmeOpen[project.name] ?? { status: 'idle' as const };
            const languages = project.languageBreakdown.length
              ? project.languageBreakdown.map(({ name }) => name)
              : project.languages.length
                ? project.languages
                : project.language
                  ? [project.language]
                  : [];
            return (
              <Reveal key={project.name} delay={Math.min(index * 45, 240)}>
                <article className={styles.projectRow} id={`project-${project.name}`}>
                  <div className={styles.projectIndex}>{String(index + 1).padStart(2, '0')}</div>
                  <div className={styles.projectMain}>
                    <div className={styles.projectHeader}>
                      <div className={styles.projectHeading}>
                        <div className={styles.projectTopline}>
                          <Anchor
                            href={project.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.projectTitle}
                            onClick={() => trackEvent('github_repo', { repo: project.name })}
                          >
                            {project.displayName ?? project.name}
                            <IconArrowUpRight size={18} />
                          </Anchor>
                          <ProjectLabels labels={project.labels} lang={lang} />
                        </div>
                        {project.description && (
                          <p className={styles.projectDescription}>{project.description}</p>
                        )}
                      </div>
                      <ProjectActions repoName={project.name} lang={lang} variant="side" />
                    </div>
                    {formatDate(project.updated_at, lang) && (
                      <p className={styles.projectMeta}>
                        {lang === 'en' ? 'Last updated' : 'Atualizado'}:{' '}
                        {formatDate(project.updated_at, lang)}
                      </p>
                    )}
                    <div className={styles.projectDetails}>
                      {[
                        [lang === 'en' ? 'LANGUAGES' : 'LINGUAGENS', languages],
                        [lang === 'en' ? 'LIBRARIES' : 'BIBLIOTECAS', project.libraries],
                        [lang === 'en' ? 'TOOLS' : 'FERRAMENTAS', project.tools],
                      ]
                        .filter(([, items]) => (items as string[]).length)
                        .map(([label, items]) => (
                          <div className={styles.detailGroup} key={label as string}>
                            <span>{label}</span>
                            <p>{(items as string[]).join(' / ')}</p>
                          </div>
                        ))}
                    </div>
                    <ProjectReadme
                      projectName={project.name}
                      state={readme}
                      lang={lang}
                      onToggle={onToggleReadme}
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
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
