'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import { Anchor, Box, Container, Group, Stack, Title } from '@mantine/core';
import { contact } from '@/data';
import { t, type Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';

const MOBILE_BREAKPOINT = 768;

function isMobile(): boolean {
  if (typeof window === 'undefined') return true;
  return (
    window.innerWidth < MOBILE_BREAKPOINT ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
}

const ContactMinigame = dynamic(
  () => import('@/components/ContactMinigame').then((mod) => ({ default: mod.ContactMinigame })),
  { ssr: false }
);

export type ContactPageProps = {
  lang: Lang;
};

export function ContactPage({ lang }: ContactPageProps) {
  const [showMinigame, setShowMinigame] = useState(false);

  useEffect(() => {
    setShowMinigame(!isMobile());
  }, []);

  return (
    <Box component="main" py="xl">
      <Container size="md" mx="auto" maw={640}>
        <Stack
          gap="xl"
          align="center"
          ta="center"
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
          }}
        >
          <Title
            order={1}
            component={motion.h1}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
            }}
          >
            {t(lang, 'contact.get_in_touch')}
          </Title>
          <Box
            component={motion.div}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
            }}
          >
            <Anchor
              href={`https://github.com/${contact.github}`}
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              underline="hover"
              onClick={() => trackEvent('github')}
            >
              <Group gap="xs">
                <IconBrandGithub size={20} />
                GitHub
              </Group>
            </Anchor>
          </Box>
          <Box
            component={motion.div}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
            }}
          >
            <Anchor
              href={`https://linkedin.com/in/${contact.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              underline="hover"
              onClick={() => trackEvent('linkedin')}
            >
              <Group gap="xs">
                <IconBrandLinkedin size={20} />
                LinkedIn
              </Group>
            </Anchor>
          </Box>
          <Box
            component={motion.div}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
            }}
          >
            <Anchor href={`mailto:${contact.email}`} size="md" underline="hover">
              <Group gap="xs">
                <IconMail size={20} />
                {t(lang, 'contact.send_email')}
              </Group>
            </Anchor>
          </Box>
        </Stack>
      </Container>
      {showMinigame && <ContactMinigame />}
    </Box>
  );
}
