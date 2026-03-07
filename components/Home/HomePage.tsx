'use client';

import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconCpu, IconDatabase } from '@tabler/icons-react';
import {
  Box,
  Button,
  Container,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { about } from '@/data/about';
import { skills, type SkillItem } from '@/data/skills';
import { t, type Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import { useProjects, type EnrichedProject } from '@/lib/use-projects';
import { LandingHero } from './LandingHero';

const SKILL_CATEGORIES = [
  'languages',
  'frameworks',
  'data',
  'libraries',
  'databases',
  'tools',
] as const;

const ICON_SIZE = 24;

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
        style={{ objectFit: 'contain', flexShrink: 0 }}
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
        style={{ objectFit: 'contain', flexShrink: 0 }}
      />
    );
  }
  if (item.icon && TABLER_ICON_MAP[item.icon]) {
    const IconComponent = TABLER_ICON_MAP[item.icon];
    return <IconComponent size={ICON_SIZE} />;
  }
  return null;
}

export type HomePageProps = {
  lang: Lang;
};

function getProjectsHref(lang: Lang): string {
  return lang === 'en' ? '/en/projects' : '/projects';
}

function HomeProjectCard({ project }: { project: EnrichedProject }) {
  return (
    <Paper withBorder p="lg" radius="md" shadow="sm">
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
      </Stack>
    </Paper>
  );
}

export function HomePage({ lang }: HomePageProps) {
  const projectsHref = getProjectsHref(lang);
  const { state } = useProjects();
  const projects = state.status === 'success' ? state.projects.slice(0, 3) : [];

  return (
    <Box component="main" py="xl">
      <LandingHero lang={lang} />
      <Container size="md">
        <Stack gap="xl">
          {/* About — title and each paragraph fade in one after the other */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
            }}
          >
            <Stack gap="lg">
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
                }}
              >
                <Title order={2}>{t(lang, 'sections.about_me')}</Title>
              </motion.div>
              {(about.home_content[lang].split(/\n\n+/) as string[])
                .map((p) => p.trim())
                .filter(Boolean)
                .map((paragraph, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
                    }}
                  >
                    <Text style={{ whiteSpace: 'pre-line' }}>{paragraph}</Text>
                  </motion.div>
                ))}
            </Stack>
          </motion.div>

          {/* Skills — animate in view: title then each card right-to-left in order */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
            }}
          >
            <Stack gap="md">
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 36 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                }}
              >
                <Title order={2}>{t(lang, 'sections.skills')}</Title>
              </motion.div>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" style={{ alignItems: 'stretch' }}>
                {SKILL_CATEGORIES.map((category) => (
                  <motion.div
                    key={category}
                    style={{ height: '100%', minHeight: 0 }}
                    variants={{
                      hidden: { opacity: 0, x: 36 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                    }}
                  >
                    <Paper withBorder p="md" radius="sm" style={{ height: '100%' }}>
                    <Stack gap="sm">
                      <Text size="sm" fw={600} c="gray.5">
                        {t(lang, `skills.${category}`)}
                      </Text>
                      <Group gap="xs" wrap="wrap">
                        {(skills[category] as SkillItem[]).map((item) => (
                          <Group key={item.name} gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
                            <SkillIcon item={item} />
                            <Text size="sm" lineClamp={1}>
                              {item.name}
                            </Text>
                          </Group>
                        ))}
                      </Group>
                    </Stack>
                  </Paper>
                </motion.div>
              ))}
              </SimpleGrid>
            </Stack>
          </motion.div>

          {/* Recent projects: top 3, title + description only — animate in view */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
          >
            <Stack gap="md">
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 36 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                }}
              >
                <Title order={2}>{t(lang, 'home.recent_projects')}</Title>
              </motion.div>
              {state.status === 'loading' && (
                <Group justify="center" py="xl">
                  <Loader size="sm" />
                </Group>
              )}
              {state.status === 'success' && projects.length > 0 && (
                <>
                  <Stack gap="md">
                    {projects.map((project) => (
                      <motion.div
                        key={project.name}
                        variants={{
                          hidden: { opacity: 0, y: 24 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                        }}
                      >
                        <HomeProjectCard project={project} />
                      </motion.div>
                    ))}
                  </Stack>
                  <motion.div
                    style={{ width: '100%' }}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
                    }}
                  >
                    <Button component={Link} href={projectsHref} variant="light" size="sm" fullWidth>
                      {t(lang, 'home.see_all_projects')}
                    </Button>
                  </motion.div>
                </>
              )}
            {state.status === 'success' && projects.length === 0 && (
              <Text size="sm" c="dimmed">
                {t(lang, 'projects.no_repos')}
              </Text>
            )}
            {(state.status === 'error' || state.status === 'empty') && (
              <Button component={Link} href={projectsHref} variant="light" size="sm">
                {t(lang, 'home.see_all_projects')}
              </Button>
            )}
            </Stack>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
}
