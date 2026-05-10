'use client';

import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { IconCpu, IconDatabase } from '@tabler/icons-react';
import { Box, Container, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { about } from '@/data/about';
import { skills, type SkillItem } from '@/data/skills';
import { t, type Lang } from '@/lib/i18n';
import { BruteCard } from '@/components/BruteCard';
import { LandingHero } from './LandingHero';
import { GenerativeCanvas } from './GenerativeCanvas';
import { useThemeContext } from '@/components/ThemeProvider';

const SKILL_CATEGORIES = [
  'languages',
  'backend',
  'frontend',
  'ai_automations',
  'data',
  'cloud_devops',
] as const;

const ICON_SIZE = 18;

const TABLER_ICON_MAP: Record<string, ComponentType<{ size?: number }>> = {
  memory: IconCpu,
  database: IconDatabase,
};

function SkillIcon({ item }: { item: SkillItem }) {
  if (item.icon_url) {
    return <img src={item.icon_url} alt="" width={ICON_SIZE} height={ICON_SIZE} />;
  }
  if (item.simple_icon) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${item.simple_icon}`}
        alt=""
        width={ICON_SIZE}
        height={ICON_SIZE}
      />
    );
  }
  const TablerIcon = item.icon ? TABLER_ICON_MAP[item.icon] : undefined;
  if (TablerIcon) return <TablerIcon size={ICON_SIZE} />;
  return null;
}

export type HomePageProps = { lang: Lang };

export function HomePage({ lang }: HomePageProps) {
  const { theme } = useThemeContext();
  const isNerv = theme === 'nerv';
  const primaryColor = isNerv ? '#87FF5F' : '#D4790A';
  const borderColor = 'var(--mantine-color-dark-6)';

  return (
    <Box component="main" pb="xl">
      {/* HERO — split into two columns */}
      <Box py="xl">
        <Container size="md">
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--mantine-spacing-xl)',
              alignItems: 'center',
            }}
          >
            <Box>
              <LandingHero lang={lang} />
            </Box>
            <Box
              visibleFrom="sm"
              style={{
                height: 320,
                borderLeft: `1px solid ${borderColor}`,
                paddingLeft: 'var(--mantine-spacing-xl)',
                overflow: 'hidden',
              }}
            >
              <GenerativeCanvas />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* SYSTEM LOG — about text */}
      <Box
        style={{
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
        }}
        py="xl"
      >
        <Container size="md">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <Stack gap="md">
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.3 } },
                }}
              >
                <Text
                  size="xs"
                  c="dimmed"
                  style={{ letterSpacing: '0.06em' }}
                >
                  SYS.LOG {'//'} {t(lang, 'sections.about_me').toUpperCase()}
                </Text>
              </motion.div>
              {(about.home_content[lang].split(/\n\n+/) as string[])
                .map((p) => p.trim())
                .filter(Boolean)
                .map((paragraph, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                    }}
                  >
                    <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-line', letterSpacing: '0.02em' }}>
                      <Text span c={primaryColor} mr="xs">
                        {'>'}
                      </Text>
                      {paragraph}
                    </Text>
                  </motion.div>
                ))}
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* SKILLS MATRIX */}
      <Box py="xl">
        <Container size="md">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
          >
            <Stack gap="lg">
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.3 } },
                }}
              >
                <Text
                  size="xs"
                  c="dimmed"
                  style={{ letterSpacing: '0.06em' }}
                >
                  SYS.PROFICIENCY {'//'} {t(lang, 'sections.skills').toUpperCase()}
                </Text>
              </motion.div>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                {SKILL_CATEGORIES.map((category, ci) => (
                  <motion.div
                    key={category}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.35, delay: ci * 0.04 },
                      },
                    }}
                  >
                    <BruteCard style={{ height: '100%' }}>
                      <Stack gap="xs">
                        <Group justify="space-between" wrap="nowrap">
                          <Text
                            size="xs"
                            fw={700}
                            c={primaryColor}
                            style={{ letterSpacing: '0.05em' }}
                          >
                            [{t(lang, `skills.${category}`).toUpperCase()}]
                          </Text>
                          <Text size="xs" c="dimmed">
                            {(skills[category] as SkillItem[]).length} items
                          </Text>
                        </Group>
                        <Box
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                            gap: 6,
                          }}
                        >
                          {(skills[category] as SkillItem[]).map((item) => (
                            <Group key={item.name} gap={4} wrap="nowrap">
                              <SkillIcon item={item} />
                              <Text size="xs" c="dimmed">
                                {item.name}
                              </Text>
                            </Group>
                          ))}
                        </Box>
                      </Stack>
                    </BruteCard>
                  </motion.div>
                ))}
              </SimpleGrid>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
