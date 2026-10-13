'use client';

import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';
import { ProjectLabels } from '@/components/Projects/ProjectLabels';
import { getFallbackProjects } from '@/data/project_fallback';
import { t, type Lang } from '@/lib/i18n';
import { useProjects } from '@/lib/use-projects';
import { ProjectPreview, type ProjectPreviewKind } from './ProjectPreview';
import homeStyles from './HomePage.module.css';
import styles from './ProjectsSection.module.css';

const PROJECT_PREVIEWS: Record<string, ProjectPreviewKind> = {
  JobAppliesTracker: 'tracker',
  ShScriptHub: 'scriptHub',
  'AutoPot-DR': 'memory',
};

export function ProjectsSection({ lang }: { lang: Lang }) {
  const { state } = useProjects(lang);
  const fallbackProjects = getFallbackProjects(lang);
  const projects = (
    state.status === 'success' && state.projects.length ? state.projects : fallbackProjects
  ).slice(0, 3);
  const projectsHref = lang === 'en' ? '/en/projects' : '/projects';

  return (
    <section className={homeStyles.section} id="projects" aria-labelledby="projects-title">
      <div className={`${homeStyles.sectionHead} ${styles.projectsHead}`}>
        <h2 className={homeStyles.sectionTitle} id="projects-title">
          {t(lang, 'sections.projects')}
        </h2>
        <Link className={styles.allProjects} href={projectsHref}>
          {t(lang, 'home.see_all_projects')} <IconArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.projectList}>
        {projects.map((project, index) => {
          const tags = Array.from(new Set([...project.languages, ...project.libraries])).slice(
            0,
            6
          );
          const detailHref = `${projectsHref}#project-${encodeURIComponent(project.name)}`;
          return (
            <article className={styles.projectRow} key={project.name} data-project-row>
              <span className={styles.projectNumber}>{String(index + 1).padStart(2, '0')}</span>
              <ProjectPreview kind={PROJECT_PREVIEWS[project.name] ?? 'repository'} />
              <div className={styles.projectCopy}>
                <h3 className={styles.projectTitle}>
                  <Link href={detailHref}>{project.name}</Link>
                  <ProjectLabels labels={project.labels} lang={lang} />
                </h3>
                <p className={styles.projectDescription}>{project.description}</p>
              </div>
              <div
                className={styles.projectTags}
                aria-label={lang === 'en' ? 'Technologies' : 'Tecnologias'}
              >
                {tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <Link
                className={styles.projectLink}
                href={detailHref}
                aria-label={`${lang === 'en' ? 'View project' : 'Ver projeto'} ${project.name}`}
              >
                {lang === 'en' ? 'View project' : 'Ver projeto'}
                <IconArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
