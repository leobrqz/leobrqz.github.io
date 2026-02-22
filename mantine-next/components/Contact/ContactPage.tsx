'use client';

import { Container, Stack, Title, Anchor, Box, Group } from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import { contact } from '../../data';
import { t, type Lang } from '../../lib/i18n';

export type ContactPageProps = {
  lang: Lang;
};

export function ContactPage({ lang }: ContactPageProps) {
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
    </Box>
  );
}
