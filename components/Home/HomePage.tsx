'use client';

import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconCpu, IconDatabase } from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Button,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { about } from '@/data/about';
import { skills, type SkillItem } from '@/data/skills';
import { t, type Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import { useProjects } from '@/lib/use-projects';
import { ProjectLabels } from '@/components/Projects/ProjectLabels';
import { BruteCard } from '@/components/BruteCard';
import { TerminalText } from '@/components/TerminalText';
import { LandingHero } from './LandingHero';
import { useThemeContext } from '@/components/ThemeProvider';

const SKILL_CATEGORIES = [
  'languages',
  'backend',
  'frontend',
  'ai_automations',
  'data',
  'cloud_devops',
] as const;

const ICON_SIZE = 20;

const TABLER_ICON_MAP: Record<string, ComponentType<{ size?: number }>> = {
  memory: IconCpu,
  database: IconDatabase,
};

function SkillIcon({ item }: { item: SkillItem }) {
  if (item.icon_url) {
    return (
      <img src={item.icon_url} alt="" width={ICON_SIZE} height={ICON_SIZE} />
    );
  }
  if (item.simple_icon) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${item.simple_icon}/999999`}
        alt=""
        width={ICON_SIZE}
        height={ICON_SIZE}
      />
    );
  }
  const TablerIcon = item.icon ? TABLER_ICON_MAP[item.icon] : undefined;
  if (TablerIcon) {
    return <TablerIcon size={ICON_SIZE} />;
  }
  return null;
}

export type HomePageProps = { lang: Lang };

export function HomePage({ lang }: HomePageProps) {
  const { state } = useProjects();
  const { theme } = useThemeContext();
  const isNerv = theme === 'nerv';

  const primaryShade = isNerv ? 'evaGreen.4' : 'lclRust.5';
  const projects = state.status === 'success' ? state.projects : [];
  const recentProjects = projects.slice(0, 3);

  return (
    <Box component="main" pb="xl">
      <LandingHero lang={lang} />

      <Container size="md">
        <Stack gap="xl">
          {/* About */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
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
                  {'>'} {t(lang, 'sections.about_me').toLowerCase()}
                </Text>
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
                    <BruteCard style={{ backgroundColor: 'transparent' }}>
                      <TerminalText size="sm" prompt>
                        {paragraph}
                      </TerminalText>
                    </BruteCard>
                  </motion.div>
                ))}
            </Stack>
          </motion.div>

          {/* Skills */}
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
                  hidden: { opacity: 0, x: 24 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                }}
              >
                <Text size="sm" c="dimmed" fw={600} style={{ letterSpacing: '0.06em' }}>
                  {'>'} {t(lang, 'sections.skills').toLowerCase()}
                </Text>
              </motion.div>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {SKILL_CATEGORIES.map((category) => (
                  <motion.div
                    key={category}
                    variants={{
                      hidden: { opacity: 0, x: 24 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                    }}
                  >
                    <BruteCard style={{ height: '100%' }}>
                      <Stack gap="xs">
                        <Text
                          size="xs"
                          fw={700}
                          c={primaryShade}
                          style={{ letterSpacing: '0.05em' }}
                        >
                          {t(lang, `skills.${category}`).toUpperCase()}
                        </Text>
                        <Group gap="xs" wrap="wrap">
                          {(skills[category] as SkillItem[]).map((item) => (
                            <Group key={item.name} gap="xs" wrap="nowrap">
                              <SkillIcon item={item} />
                              <Text size="xs">{item.name}</Text>
                            </Group>
                          ))}
                        </Group>
                      </Stack>
                    </BruteCard>
                  </motion.div>
                ))}
              </SimpleGrid>
            </Stack>
          </motion.div>

          {/* Recent Projects */}
          {recentProjects.length > 0 && (
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
                    hidden: { opacity: 0, x: 24 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                  }}
                >
                  <Text size="sm" c="dimmed" fw={600} style={{ letterSpacing: '0.06em' }}>
                    {'>'} {t(lang, 'home.recent_projects').toLowerCase()}
                  </Text>
                </motion.div>
                {recentProjects.map((project) => (
                  <motion.div
                    key={project.name}
                    variants={{
                      hidden: { opacity: 0, x: 24 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                    }}
                  >
                    <BruteCard>
                      <Stack gap="xs">
                        <Group justify="space-between" align="center" wrap="wrap">
                          <Anchor
                            href={project.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            fw={700}
                            size="sm"
                            c={primaryShade}
                            onClick={() => trackEvent('github_repo', { repo: project.name })}
                          >
                            {project.name}
                          </Anchor>
                          <ProjectLabels labels={project.labels} lang={lang} />
                        </Group>
                        {project.description && (
                          <Text size="xs" c="dimmed" lineClamp={2}>
                            {project.description}
                          </Text>
                        )}
                      </Stack>
                    </BruteCard>
                  </motion.div>
                ))}
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
                  }}
                >
                  <Button
                    component={Link}
                    href={lang === 'en' ? '/en/projects' : '/projects'}
                    variant="subtle"
                    size="xs"
                    c="dimmed"
                    style={{ letterSpacing: '0.04em' }}
                  >
                    {'>'} {t(lang, 'home.see_all_projects').toLowerCase()}
                  </Button>
                </motion.div>
              </Stack>
            </motion.div>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
