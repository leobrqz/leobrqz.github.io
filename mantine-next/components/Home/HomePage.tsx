'use client';

import {
  Container,
  Stack,
  Title,
  Text,
  Group,
  Box,
  SimpleGrid,
  Paper,
  Button,
  Loader,
} from '@mantine/core';
import { IconCpu, IconDatabase } from '@tabler/icons-react';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { contact } from '../../data/contact';
import { about } from '../../data/about';
import { skills, type SkillItem } from '../../data/skills';
import { t, type Lang } from '../../lib/i18n';
import { useProjects, type EnrichedProject } from '../../lib/use-projects';
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
          {/* About */}
          <Stack gap="sm">
            <Title order={2}>{t(lang, 'sections.about_me')}</Title>
            <Text style={{ whiteSpace: 'pre-line' }}>{about.home_content[lang]}</Text>
          </Stack>

          {/* Skills */}
          <Stack gap="md">
            <Title order={2}>{t(lang, 'sections.skills')}</Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {SKILL_CATEGORIES.map((category) => (
                <Paper key={category} withBorder p="md" radius="sm">
                  <Stack gap="sm">
                    <Text size="sm" fw={600} c="dimmed">
                      {t(lang, `skills.${category}`)}
                    </Text>
                    <Group gap="xs" wrap="wrap">
                      {skills[category].map((item) => (
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
              ))}
            </SimpleGrid>
          </Stack>

          {/* Recent projects: top 3, title + description only */}
          <Stack gap="md">
            <Title order={2}>{t(lang, 'home.recent_projects')}</Title>
            {state.status === 'loading' && (
              <Group justify="center" py="xl">
                <Loader size="sm" />
              </Group>
            )}
            {state.status === 'success' && projects.length > 0 && (
              <>
                <Stack gap="md">
                  {projects.map((project) => (
                    <HomeProjectCard key={project.name} project={project} />
                  ))}
                </Stack>
                <Button component={Link} href={projectsHref} variant="light" size="sm">
                  {t(lang, 'home.see_all_projects')}
                </Button>
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
        </Stack>
      </Container>
    </Box>
  );
}
