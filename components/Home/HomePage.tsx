'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import { IconArrowUpRight, IconCpu, IconDatabase } from '@tabler/icons-react';
import { Anchor, Box, Container } from '@mantine/core';
import { about } from '@/data/about';
import { getFallbackProjects } from '@/data/project_fallback';
import { skills, type SkillItem } from '@/data/skills';
import { t, type Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import { useProjects, type EnrichedProject } from '@/lib/use-projects';
import { ProjectLabels } from '@/components/Projects/ProjectLabels';
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

const TABLER_ICON_MAP: Record<string, ComponentType<{ size?: number }>> = {
  memory: IconCpu,
  database: IconDatabase,
};

const VISUAL_CLASSES = [styles.visualBlue, styles.visualOrange, styles.visualGreen];

function SkillIcon({ item }: { item: SkillItem }) {
  if (item.icon_url) {
    return <img src={item.icon_url} alt="" width={ICON_SIZE} height={ICON_SIZE} className={styles.skillIcon} />;
  }
  if (item.simple_icon) {
    return <img src={`https://cdn.simpleicons.org/${item.simple_icon}`} alt="" width={ICON_SIZE} height={ICON_SIZE} className={styles.skillIcon} />;
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

function ProjectTrace({ project, index, lang }: { project: EnrichedProject; index: number; lang: Lang }) {
  const technology = project.language ?? project.languages[0] ?? (lang === 'en' ? 'system' : 'sistema');
  const traceStages = lang === 'en'
    ? ['context', technology.toLowerCase(), 'product']
    : ['contexto', technology.toLowerCase(), 'produto'];

  return (
    <div className={`${styles.projectVisual} ${VISUAL_CLASSES[index % VISUAL_CLASSES.length]}`} aria-hidden="true">
      <div className={styles.visualMeta}>
        <span>{lang === 'en' ? 'SYSTEM TRACE' : 'TRACE DE SISTEMA'}</span>
        <span>{technology}</span>
      </div>
      <div className={styles.traceMap}>
        <span className={styles.traceRoute} />
        {traceStages.map((stage, stageIndex) => (
          <span className={styles.traceNode} key={`${project.name}-${stage}`}>
            <i />
            <b>{stage}</b>
            {stageIndex < traceStages.length - 1 && <em>→</em>}
          </span>
        ))}
      </div>
      <div className={styles.traceFooter}>
        <span>{project.libraries[0] ?? (lang === 'en' ? 'Built to hold' : 'Feito para durar')}</span>
        <span>{lang === 'en' ? 'follow the path' : 'siga o fluxo'}</span>
      </div>
    </div>
  );
}

function HomeProjectCard({ project, index, lang }: { project: EnrichedProject; index: number; lang: Lang }) {
  const tags = Array.from(new Set([...project.languages, ...project.libraries])).slice(0, 5);

  return (
    <article className={styles.projectCard}>
      <ProjectTrace project={project} index={index} lang={lang} />
      <div className={styles.projectContent}>
        <div className={styles.projectKicker}>
          <span>{lang === 'en' ? 'Selected work' : 'Trabalho selecionado'}</span>
          <ProjectLabels labels={project.labels} lang={lang} />
        </div>
        <h3>
          <Anchor
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('github_repo', { repo: project.name })}
          >
            {project.name} <IconArrowUpRight size={18} stroke={1.8} />
          </Anchor>
        </h3>
        <p className={styles.projectDescription}>{project.description}</p>
        <div className={styles.projectFooter}>
          <div className={styles.projectTags}>
            {tags.map((tag, tagIndex) => <span key={tag}>{tag}{tagIndex < tags.length - 1 ? ' / ' : ''}</span>)}
          </div>
          <span className={styles.projectLink}>GitHub ↗</span>
        </div>
      </div>
    </article>
  );
}

export function HomePage({ lang }: HomePageProps) {
  const { state } = useProjects();
  const fallbackProjects = getFallbackProjects(lang);
  const projects = state.status === 'success' && state.projects.length > 0
    ? state.projects.slice(0, 3)
    : fallbackProjects.slice(0, 3);
  const projectsHref = lang === 'en' ? '/en/projects' : '/projects';

  return (
    <Box component="main" className={styles.home}>
      <LandingHero lang={lang} />

      <Container size="lg" className={styles.homeContainer}>
        <section className={styles.section}>
          <SectionHeading kicker={t(lang, 'home.about_kicker')} title={t(lang, 'sections.about_me')} />
          <div className={styles.profileGrid}>
            <p className={styles.profileCopy}>{about.home_profile[lang]}</p>
            <div className={styles.profileNotes}>
              <div>
                <span className={styles.profileMark} aria-hidden="true" />
                <div><strong>{lang === 'en' ? 'I build the whole system' : 'Construo o sistema inteiro'}</strong><p>{lang === 'en' ? 'From backend decisions to the interface people actually use.' : 'Das decisões de backend à interface que as pessoas realmente usam.'}</p></div>
              </div>
              <div>
                <span className={styles.profileMark} aria-hidden="true" />
                <div><strong>{lang === 'en' ? 'Clarity before complexity' : 'Clareza antes da complexidade'}</strong><p>{lang === 'en' ? 'Good software makes the next decision easier.' : 'Software bom torna a próxima decisão mais fácil.'}</p></div>
              </div>
              <div>
                <span className={styles.profileMark} aria-hidden="true" />
                <div><strong>{lang === 'en' ? 'Curiosity with momentum' : 'Curiosidade em movimento'}</strong><p>{lang === 'en' ? 'I learn by building, testing and shipping.' : 'Aprendo construindo, testando e entregando.'}</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <SectionHeading kicker={t(lang, 'home.stack_kicker')} title={t(lang, 'sections.skills')} />
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
          <div className={styles.projectGrid}>
            {projects.map((project, index) => <HomeProjectCard key={project.name} project={project} index={index} lang={lang} />)}
          </div>
          <Anchor component={Link} href={projectsHref} className={styles.allProjectsLink} underline="never">
            {t(lang, 'home.see_all_projects')} <IconArrowUpRight size={17} />
          </Anchor>
        </section>

        <footer className={styles.homeFooter}>
          <span>LEONARDO BRIQUEZI / 2026</span>
          <span>{t(lang, 'sidebar.role')} · Florianópolis</span>
        </footer>
      </Container>
    </Box>
  );
}
