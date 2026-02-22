'use client';

import {
  Container,
  Stack,
  Title,
  Text,
  Group,
  Anchor,
  Button,
  List,
  Box,
  Divider,
  Paper,
} from '@mantine/core';
import { IconFileDownload } from '@tabler/icons-react';
import {
  contact,
  about,
  education,
  resume_skills,
  resume_projects,
  certifications,
  languages_spoken,
} from '../../data';
import { t, type Lang } from '../../lib/i18n';
import { CV_PDF_URL, CV_PDF_FILENAME } from '../../config/site';

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
            <Anchor href={`mailto:${contact.email}`} size="sm">
              {contact.email}
            </Anchor>
          </Stack>
          <Divider />
          {/* Summary */}
          <Stack gap="xs">
            <Title order={2} size="h3">
              {t(lang, 'resume.summary')}
            </Title>
            <Text style={{ whiteSpace: 'pre-line' }}>{about.content[lang]}</Text>
          </Stack>

          {/* Resume projects */}
          <Stack gap="xs">
            <Title order={2} size="h3">
              {t(lang, 'resume.projects')}
            </Title>
            {resume_projects.map((project, i) => (
              <Stack key={i} gap={4}>
                <Anchor href={project.url} target="_blank" rel="noopener noreferrer" fw={600}>
                  {project.name[lang]}
                </Anchor>
                <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                  {project.description[lang]}
                </Text>
                <Text size="xs" c="dimmed">
                  {project.technologies.join(' · ')}
                </Text>
              </Stack>
            ))}
          </Stack>

          {/* Resume skills: one line per category */}
          <Stack gap="xs">
            <Title order={2} size="h3">
              {t(lang, 'resume.skills')}
            </Title>
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
            <List size="sm" spacing={2}>
              {languages_spoken.map((entry, i) => (
                <List.Item key={i}>
                  {entry.name[lang]} — {entry.level[lang]}
                </List.Item>
              ))}
            </List>
          </Stack>

          {/* Certifications */}
          <Stack gap="xs">
            <Title order={2} size="h3">
              {t(lang, 'resume.certifications')}
            </Title>
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
                  <Text size="sm" c="dimmed" style={{ textAlign: 'right' }}>
                    {cert.issuer} · {cert.date}
                  </Text>
                </Group>
                <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                  {cert.description[lang]}
                </Text>
              </Stack>
            ))}
          </Stack>

          {/* Education */}
          <Stack gap="xs">
            <Title order={2} size="h3">
              {t(lang, 'resume.education')}
            </Title>
            {education.map((entry, i) => (
              <Stack key={i} gap={4}>
                <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
                  <Text fw={600}>
                    {entry.degree[lang]}
                    {entry.period[lang]}
                  </Text>
                  <Text size="sm" c="dimmed" style={{ textAlign: 'right' }}>
                    {entry.institution}
                    {entry.location ? ` · ${entry.location}` : ''}
                  </Text>
                </Group>
                <Text size="sm" c="dimmed">
                  {entry.start_date} — {entry.end_date}
                </Text>
                <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                  {entry.description[lang]}
                </Text>
              </Stack>
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
          right: 'max(var(--mantine-spacing-md), calc((100vw - min(48rem, 100vw - 2 * var(--mantine-spacing-md))) / 2 + var(--mantine-spacing-md) - 120px))',
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
