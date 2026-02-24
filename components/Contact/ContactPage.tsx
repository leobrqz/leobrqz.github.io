'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import { Anchor, Box, Container, Group, Stack, Title } from '@mantine/core';
import { contact } from '@/data';
import { t, type Lang } from '@/lib/i18n';

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
        <Stack gap="xl" align="center" ta="center">
          <Title order={1}>{t(lang, 'contact.get_in_touch')}</Title>
          <Stack gap="sm" align="center">
            <Anchor
              href={`https://github.com/${contact.github}`}
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              underline="hover"
            >
              <Group gap="xs">
                <IconBrandGithub size={20} />
                GitHub
              </Group>
            </Anchor>
            <Anchor
              href={`https://linkedin.com/in/${contact.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              underline="hover"
            >
              <Group gap="xs">
                <IconBrandLinkedin size={20} />
                LinkedIn
              </Group>
            </Anchor>
            <Anchor href={`mailto:${contact.email}`} size="md" underline="hover">
              <Group gap="xs">
                <IconMail size={20} />
                {t(lang, 'contact.send_email')}
              </Group>
            </Anchor>
          </Stack>
        </Stack>
      </Container>
      {showMinigame && <ContactMinigame />}
    </Box>
  );
}
