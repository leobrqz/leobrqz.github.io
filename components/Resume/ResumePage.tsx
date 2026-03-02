"use client";

import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { IconFileDownload } from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { CV_PDF_FILENAME, CV_PDF_URL } from "@/config/site";
import {
  about,
  certifications,
  contact,
  education,
  languages_spoken,
  resume_projects,
  resume_skills,
} from '@/data';
import { t, type Lang } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import styles from "./ResumePage.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
  const [view, setView] = useState<'web' | 'pdf'>('web');
  const [pdfWidth, setPdfWidth] = useState<number>(0);
  const [pdfLoading, setPdfLoading] = useState(true);
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);

  const pdfRenderWidth = pdfWidth > 0 ? pdfWidth : undefined;

  useEffect(() => {
    if (view === 'pdf') {
      setPdfLoading(true);
    }
  }, [view]);

  useEffect(() => {
    if (view !== 'pdf') {
      return;
    }

    const el = pdfContainerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      return;
    }

    const updateWidth = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width) {
        setPdfWidth(rect.width);
      }
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [view]);

  return (
    <Box component="main" pt="md" pb="xl">
      <Container size="md">
        <Stack gap="lg">
          <Group justify="center">
            <Group gap="xs">
              <Button
                size="xs"
                variant={view === 'web' ? 'filled' : 'subtle'}
                onClick={() => setView('web')}
              >
                Web
              </Button>
              <Button
                size="xs"
                variant={view === 'pdf' ? 'filled' : 'subtle'}
                onClick={() => setView('pdf')}
              >
                PDF
              </Button>
            </Group>
          </Group>

          {view === 'pdf' ? (
            <Box className={styles.pdfViewer} style={{ width: '100%' }}>
              <Box
                ref={pdfContainerRef}
                style={{
                  width: '100%',
                  minHeight: 400,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {pdfLoading && (
                  <Box
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--mantine-color-body)',
                      borderRadius: 'var(--mantine-radius-sm)',
                    }}
                  >
                    <Loader size="lg" />
                  </Box>
                )}
                <Document
                  file={CV_PDF_URL}
                  onLoadSuccess={() => setPdfLoading(false)}
                >
                  <Page
                    pageNumber={1}
                    width={pdfRenderWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </Box>
            </Box>
          ) : (
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
                    onClick={() => trackEvent('github')}
                  >
                    GitHub
                  </Anchor>
                  <Anchor
                    href={`https://linkedin.com/in/${contact.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    onClick={() => trackEvent('linkedin')}
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
                    <Anchor href={project.url} target="_blank" rel="noopener noreferrer" fw={600} onClick={() => trackEvent('github_repo', { repo: project.name[lang] })}>
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
          )}
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
          onClick={() => trackEvent('resume_download')}
        >
          <IconFileDownload size={24} />
        </Button>
      </Box>
    </Box>
  );
}
