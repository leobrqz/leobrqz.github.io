'use client';

import { motion } from 'framer-motion';
import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import { Anchor, Avatar, Box, Container, Group, Stack, Text } from '@mantine/core';
import { contact } from '@/data';
import { t, type Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import { BruteCard } from '@/components/BruteCard';
import { useThemeContext } from '@/components/ThemeProvider';

export type ContactPageProps = { lang: Lang };

export function ContactPage({ lang }: ContactPageProps) {
  const { theme } = useThemeContext();
  const isNerv = theme === 'nerv';
  const primaryColor = isNerv ? '#87FF5F' : '#D4790A';

  const channels = [
    {
      icon: IconBrandGithub,
      label: 'GITHUB',
      href: `https://github.com/${contact.github}`,
      event: 'github' as const,
      detail: `/${contact.github}`,
    },
    {
      icon: IconBrandLinkedin,
      label: 'LINKEDIN',
      href: `https://linkedin.com/in/${contact.linkedin}`,
      event: 'linkedin' as const,
      detail: `/in/${contact.linkedin}`,
    },
    {
      icon: IconMail,
      label: 'EMAIL',
      href: `mailto:${contact.email}`,
      event: 'email' as const,
      detail: contact.email,
    },
  ];

  return (
    <Box component="main" style={{ minHeight: 'calc(100vh - 44px)', display: 'flex', alignItems: 'center' }}>
      <Container size="sm" style={{ width: '100%' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
        >
          <Stack gap="xl" align="center">
            {/* Header */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.5 } },
              }}
              style={{ textAlign: 'center' }}
            >
              <Text size="sm" c="dimmed" style={{ letterSpacing: '0.08em' }}>
                COMMS.LINK
              </Text>
              <Text size="xs" c="dimmed" mt="xs" style={{ letterSpacing: '0.05em' }}>
                {t(lang, 'contact.connect_with_me').toUpperCase()}
              </Text>
            </motion.div>

            {/* 3D placeholder box — acts as visual anchor */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
              }}
            >
              <Box
                style={{
                  width: 120,
                  height: 120,
                  border: `2px solid ${primaryColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(45deg)',
                  overflow: 'hidden',
                }}
              >
                <Avatar
                  src={`https://github.com/${contact.github}.png`}
                  size={80}
                  radius={0}
                  style={{ transform: 'rotate(-45deg)', border: `1px solid ${primaryColor}` }}
                />
              </Box>
            </motion.div>

            {/* Channel cards */}
            <Box style={{ width: '100%' }}>
              <Stack gap="sm">
                {channels.map(({ icon: Icon, label, href, event, detail }) => (
                  <motion.div
                    key={label}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
                    }}
                  >
                    <Anchor
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      underline="never"
                      onClick={() => trackEvent(event)}
                    >
                      <BruteCard
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <Group justify="space-between" wrap="nowrap">
                          <Group gap="sm">
                            <Icon size={18} />
                            <Box>
                              <Text size="xs" fw={700} c={primaryColor} style={{ letterSpacing: '0.05em' }}>
                                {label}
                              </Text>
                            </Box>
                          </Group>
                          <Text size="xs" c="dimmed" style={{ letterSpacing: '0.03em' }}>
                            {detail}
                          </Text>
                        </Group>
                      </BruteCard>
                    </Anchor>
                  </motion.div>
                ))}
              </Stack>
            </Box>

            {/* Status line */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.5 } },
              }}
            >
              <Text size="xs" c="dimmed" style={{ letterSpacing: '0.05em' }}>
                STATUS: CONNECTION ESTABLISHED
              </Text>
            </motion.div>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
