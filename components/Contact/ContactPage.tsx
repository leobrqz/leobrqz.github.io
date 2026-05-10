'use client';

import { motion } from 'framer-motion';
import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import { Anchor, Box, Container, Group, Stack, Text } from '@mantine/core';
import { contact } from '@/data';
import { t, type Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import { BruteCard } from '@/components/BruteCard';
import { useThemeContext } from '@/components/ThemeProvider';

export type ContactPageProps = { lang: Lang };

export function ContactPage({ lang }: ContactPageProps) {
  const { theme } = useThemeContext();
  const isNerv = theme === 'nerv';
  const primaryShade = isNerv ? 'evaGreen.4' : 'lclRust.5';

  const links = [
    {
      icon: IconBrandGithub,
      label: 'GitHub',
      href: `https://github.com/${contact.github}`,
      event: 'github' as const,
    },
    {
      icon: IconBrandLinkedin,
      label: 'LinkedIn',
      href: `https://linkedin.com/in/${contact.linkedin}`,
      event: 'linkedin' as const,
    },
    {
      icon: IconMail,
      label: t(lang, 'contact.send_email'),
      href: `mailto:${contact.email}`,
      event: 'email' as const,
    },
  ];

  return (
    <Box component="main" py="xl">
      <Container size="md" maw={480}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
        >
          <Stack gap="md" align="center">
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
              }}
            >
              <Text size="sm" c="dimmed" fw={600} style={{ letterSpacing: '0.06em' }}>
                {'>'} {t(lang, 'contact.connect_with_me').toLowerCase()}
              </Text>
            </motion.div>
            {links.map(({ icon: Icon, label, href, event }) => (
              <motion.div
                key={label}
                style={{ width: '100%' }}
                variants={{
                  hidden: { opacity: 0, x: 24 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.35, ease: 'easeOut' },
                  },
                }}
              >
                <Anchor
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  underline="never"
                  onClick={() => trackEvent(event)}
                  style={{ width: '100%' }}
                >
                  <BruteCard
                    style={{
                      cursor: 'pointer',
                      transition: 'border-color 150ms ease',
                    }}
                  >
                    <Group gap="sm" justify="center">
                      <Icon size={20} />
                      <Text size="sm" c={primaryShade} fw={500}>
                        {label}
                      </Text>
                    </Group>
                  </BruteCard>
                </Anchor>
              </motion.div>
            ))}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
