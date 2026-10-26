'use client';

import { Box } from '@mantine/core';
import type { Lang } from '@/lib/i18n';
import { ContactInvitation } from './ContactInvitation';
import { ExperienceSection } from './ExperienceSection';
import { LandingHero } from './LandingHero';
import { ProjectsSection } from './ProjectsSection';
import { SkillsSection } from './SkillsSection';
import styles from './HomePage.module.css';

export type HomePageProps = { lang: Lang };

export function HomePage({ lang }: HomePageProps) {
  return (
    <Box component="main" className={styles.home}>
      <LandingHero lang={lang} />
      <SkillsSection lang={lang} />
      <ProjectsSection lang={lang} />
      <ExperienceSection lang={lang} />
      <ContactInvitation lang={lang} />
    </Box>
  );
}
