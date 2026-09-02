'use client';

import type { ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IconArrowUpRight, IconCpu, IconDatabase } from '@tabler/icons-react';
import { Anchor, Box, Container } from '@mantine/core';
import { ProjectLabels } from '@/components/Projects/ProjectLabels';
import { about } from '@/data/about';
import { contact } from '@/data/contact';
import { getFallbackProjects } from '@/data/project_fallback';
import { skills, type SkillItem } from '@/data/skills';
import { trackEvent } from '@/lib/analytics';
import { t, type Lang } from '@/lib/i18n';
import { useProjects, type EnrichedProject } from '@/lib/use-projects';
import { LandingHero } from './LandingHero';
import styles from './HomePage.module.css';

const SKILL_CATEGORIES = [
  'languages',
  'backend',
  'frontend',
  'ai_automations',
  'data',
  'cloud_devops',
] as const;

const ICON_SIZE = 22;
const PROJECT_MARK_CLASSES = [
  styles.projectMarkBlue,
  styles.projectMarkOrange,
  styles.projectMarkGreen,
];

const TABLER_ICON_MAP: Record<string, ComponentType<{ size?: number }>> = {
  memory: IconCpu,
  database: IconDatabase,
};

function SkillIcon({ item }: { item: SkillItem }) {
  if (item.icon_url) {
    return (
      <img
        src={item.icon_url}
        alt=""
        width={ICON_SIZE}
        height={ICON_SIZE}
        className={styles.skillIcon}
      />
    );
  }
  if (item.simple_icon) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${item.simple_icon}`}
        alt=""
        width={ICON_SIZE}
        height={ICON_SIZE}
        className={styles.skillIcon}
      />
    );
  }
  if (item.icon && TABLER_ICON_MAP[item.icon]) {
    const IconComponent = TABLER_ICON_MAP[item.icon];
    return <IconComponent size={ICON_SIZE} />;
  }
  return <span className={styles.skillFallback} aria-hidden="true" />;
}

export type HomePageProps = {
  lang: Lang;
};

function SectionHeading({ kicker, title, note }: { kicker: string; title: string; note?: string }) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        <span className={styles.eyebrow}>{kicker}</span>
        <h2>{title}</h2>
      </div>
      {note && <p>{note}</p>}
    </div>
  );
}

function projectMark(name: string): string {
  return name
    .split(/[-\s]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function HomeProjectCard({
  project,
  index,
  lang,
}: {
  project: EnrichedProject;
  index: number;
  lang: Lang;
}) {
  const tags = Array.from(new Set([...project.languages, ...project.libraries])).slice(0, 5);

  return (
    <article className={styles.projectCard}>
      <span
        className={`${styles.projectMark} ${PROJECT_MARK_CLASSES[index % PROJECT_MARK_CLASSES.length]}`}
        aria-hidden="true"
      >
        {projectMark(project.name)}
      </span>
      <div className={styles.projectContent}>
        <div className={styles.projectKicker}>
          <span>{project.language ?? (lang === 'en' ? 'Project' : 'Projeto')}</span>
          <ProjectLabels labels={project.labels} lang={lang} />
        </div>
        <h3>{project.name}</h3>
        <p className={styles.projectDescription}>{project.description}</p>
      </div>
      <div className={styles.projectStack}>
        <span className={styles.projectStackLabel}>{lang === 'en' ? 'Stack' : 'Stack'}</span>
        <span>{tags.join(' · ')}</span>
      </div>
      <Anchor
        href={project.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.projectLink}
        underline="never"
        onClick={() => trackEvent('github_repo', { repo: project.name })}
      >
        {lang === 'en' ? 'View project' : 'Ver projeto'} <IconArrowUpRight size={16} />
      </Anchor>
    </article>
  );
}

export function HomePage({ lang }: HomePageProps) {
  const { state } = useProjects();
  const fallbackProjects = getFallbackProjects(lang);
  const projects =
    state.status === 'success' && state.projects.length > 0
      ? state.projects.slice(0, 3)
      : fallbackProjects.slice(0, 3);
  const projectsHref = lang === 'en' ? '/en/projects' : '/projects';

  return (
    <Box component="main" className={styles.home}>
      <LandingHero lang={lang} />

      <Container size="lg" className={styles.homeContainer}>
        <section className={styles.section}>
          <SectionHeading
            kicker={t(lang, 'home.about_kicker')}
            title={t(lang, 'sections.about_me')}
          />
          <div className={styles.profileGrid}>
            <div className={styles.profilePhotoBlock}>
              <Image
                src="/imgs/profile.jpg"
                alt={contact.name}
                width={220}
                height={220}
                unoptimized
                className={styles.profilePhoto}
              />
              <span>
                {contact.name} / {contact.location}
              </span>
            </div>
            <div className={styles.profileCopy}>
              <p>{about.home_profile[lang]}</p>
              <p>
                {lang === 'en'
                  ? 'Most days, that means moving between APIs, databases, automations and the interface that makes the result useful.'
                  : 'Na prática, isso significa alternar entre APIs, bancos, automações e a interface que torna o resultado útil.'}
              </p>
              <Anchor
                component={Link}
                href={lang === 'en' ? '/en/resume' : '/resume'}
                className={styles.profileLink}
                underline="never"
              >
                {lang === 'en' ? 'More about me' : 'Mais sobre mim'} <IconArrowUpRight size={16} />
              </Anchor>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <SectionHeading
            kicker={t(lang, 'home.stack_kicker')}
            title={t(lang, 'sections.skills')}
          />
          <div className={styles.skillsGrid}>
            {SKILL_CATEGORIES.map((category) => (
              <div className={styles.skillGroup} key={category}>
                <span className={styles.skillGroupTitle}>{t(lang, `skills.${category}`)}</span>
                <div className={styles.skillList}>
                  {(skills[category] as SkillItem[]).map((item) => (
                    <span className={styles.skillItem} key={item.name}>
                      <SkillIcon item={item} />
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <SectionHeading
            kicker={t(lang, 'home.work_kicker')}
            title={t(lang, 'home.recent_projects')}
            note={t(lang, 'home.selected_note')}
          />
          <div className={styles.projectList}>
            {projects.map((project, index) => (
              <HomeProjectCard key={project.name} project={project} index={index} lang={lang} />
            ))}
          </div>
          <Anchor
            component={Link}
            href={projectsHref}
            className={styles.allProjectsLink}
            underline="never"
          >
            {t(lang, 'home.see_all_projects')} <IconArrowUpRight size={17} />
          </Anchor>
        </section>

        <footer className={styles.homeFooter}>
          <span>LEONARDO BRIQUEZI / 2026</span>
          <span>
            {t(lang, 'sidebar.role')} · {contact.location}
          </span>
        </footer>
      </Container>
    </Box>
  );
}
