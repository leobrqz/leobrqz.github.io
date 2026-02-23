'use client';

import React from 'react';
import { IconFileDownload } from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { CV_PDF_FILENAME, CV_PDF_URL } from '@/config/site';
import {
  about,
  certifications,
  contact,
  education,
  languages_spoken,
  resume_projects,
  resume_skills,
} from '@/data';
import { t, type Lang } from '@/lib/i18n';

const RESUME_SKILL_CATEGORIES = [
  'languages',
  'frameworks',
  'libraries',
  'databases',
  'tools',
] as const;

export type ResumePageProps = {
  lang: Lang;
};

export function ResumePage({ lang }: ResumePageProps) {
  return (
    <Box component="main" py="xl">
      <Container size="md">
        <Stack gap="xl">
          <Paper withBorder p="lg" radius="md">
            <Stack gap="xl">
              {/* Name and contact inside the box */}
              <Stack gap="xs" align="center" style={{ textAlign: 'center' }}>
                <Title order={1} size="1.75rem" fw={700}>
                  {contact.name}
                </Title>
                <Text size="sm" c="dimmed">
                  {contact.location}
                </Text>
                <Group gap="sm" justify="center" wrap="wrap">
                  <Anchor href={`mailto:${contact.email}`} size="sm">
                    {contact.email}
                  </Anchor>
                  <Anchor
                    href={`https://github.com/${contact.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                  >
                    GitHub
                  </Anchor>
                  <Anchor
                    href={`https://linkedin.com/in/${contact.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                  >
                    LinkedIn
                  </Anchor>
                </Group>
              </Stack>
              <Divider />
              {/* Summary */}
              <Stack gap="xs">
                <Title order={2} size="h3">
                  {t(lang, 'resume.summary')}
                </Title>
                <Divider color="dark.4" size="xs" />
                <Text style={{ whiteSpace: 'pre-line' }}>{about.content[lang]}</Text>
              </Stack>

              {/* Resume projects */}
              <Stack gap="xs">
                <Title order={2} size="h3">
                  {t(lang, 'resume.projects')}
                </Title>
                <Divider color="dark.4" size="xs" />
                {resume_projects.map((project, i) => (
                  <Stack key={i} gap={4}>
                    <Anchor href={project.url} target="_blank" rel="noopener noreferrer" fw={600}>
                      {project.name[lang]}
                    </Anchor>
                    <Text size="xs" c="dimmed">
                      {project.technologies.join(' · ')}
                    </Text>
                    <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                      {project.description[lang]}
                    </Text>
                  </Stack>
                ))}
              </Stack>

              {/* Resume skills: one line per category */}
              <Stack gap="xs">
                <Title order={2} size="h3">
                  {t(lang, 'resume.skills')}
                </Title>
                <Divider color="dark.4" size="xs" />
                {RESUME_SKILL_CATEGORIES.map((category) => {
                  const items = resume_skills[category];
                  if (!items?.length) {
                    return null;
                  }
                  return (
                    <Text key={category} size="sm">
                      <Text span fw={600} c="dimmed">
                        {t(lang, `resume_labels.${category}`)}:
                      </Text>{' '}
                      {items.map((item) => item.name).join(', ')}
                    </Text>
                  );
                })}
              </Stack>

              {/* Languages spoken */}
              <Stack gap="xs">
                <Title order={2} size="h3">
                  {t(lang, 'resume.languages_spoken')}
                </Title>
                <Divider color="dark.4" size="xs" />
                <Stack gap="xs" hiddenFrom="sm">
                  {languages_spoken.map((entry, i) => (
                    <Text key={i} size="sm">
                      {entry.name[lang]} ({entry.level[lang]})
                    </Text>
                  ))}
                </Stack>
                <Box
                  visibleFrom="sm"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 'var(--mantine-spacing-md)',
                  }}
                >
                  {languages_spoken.map((entry, i) => (
                    <Text
                      key={i}
                      size="sm"
                      style={{
                        flex: 1,
                        textAlign: i === 0 ? 'left' : i === 1 ? 'center' : 'right',
                      }}
                    >
                      {entry.name[lang]} ({entry.level[lang]})
                    </Text>
                  ))}
                </Box>
              </Stack>

              {/* Certifications */}
              <Stack gap="xs">
                <Title order={2} size="h3">
                  {t(lang, 'resume.certifications')}
                </Title>
                <Divider color="dark.4" size="xs" />
                {certifications.map((cert, i) => (
                  <Stack key={i} gap={4}>
                    <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
                      {cert.url ? (
                        <Anchor href={cert.url} target="_blank" rel="noopener noreferrer" fw={600}>
                          {cert.name[lang]}
                        </Anchor>
                      ) : (
                        <Text fw={600}>{cert.name[lang]}</Text>
                      )}
                      <Text size="md" fw={700} style={{ letterSpacing: '0.01em', textAlign: 'right' }}>
                        {cert.issuer}
                        <Text span size="sm" fw={400} c="dimmed"> ({cert.date})</Text>
                      </Text>
                    </Group>
                    <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                      {cert.description[lang]}
                    </Text>
                  </Stack>
                ))}
              </Stack>

              {/* Education */}
              <Stack gap="xs" style={{ listStyle: 'none', paddingLeft: 0 }}>
                <Title order={2} size="h3">
                  {t(lang, 'resume.education')}
                </Title>
                <Divider color="dark.4" size="xs" />
                {education.map((entry, i) => (
                  <Group key={i} justify="space-between" align="flex-start" wrap="wrap" gap="md">
                    <Stack gap={2}>
                      <Text fw={600}>{entry.degree[lang]}</Text>
                      <Text size="sm" c="dimmed">
                        {entry.level[lang]}
                        {entry.period[lang]}
                      </Text>
                    </Stack>
                    <Stack gap={2} align="flex-end">
                      <Text size="md" fw={700} style={{ letterSpacing: '0.01em', textAlign: 'right' }}>
                        {entry.institution}
                        <Text span size="sm" fw={400} c="dimmed"> ({entry.start_date} – {entry.end_date})</Text>
                      </Text>
                      <Text size="sm" c="dimmed">
                        {entry.location}
                      </Text>
                    </Stack>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      <Box
        component="div"
        style={{
          position: 'fixed',
          bottom: 24,
          right:
            'max(var(--mantine-spacing-md), calc((100vw - min(48rem, 100vw - 2 * var(--mantine-spacing-md))) / 2 + var(--mantine-spacing-md) - 125px))',
          zIndex: 200,
        }}
      >
        <Button
          component="a"
          href={CV_PDF_URL}
          download={CV_PDF_FILENAME}
          target="_blank"
          rel="noopener noreferrer"
          title={t(lang, 'resume.download_pdf')}
          variant="filled"
          size="lg"
          style={{ width: 56, height: 56, padding: 0, borderRadius: '50%' }}
        >
          <IconFileDownload size={24} />
        </Button>
      </Box>
    </Box>
  );
}
