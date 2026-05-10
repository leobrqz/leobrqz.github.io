'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { IconFileDownload } from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
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
import { trackEvent } from '@/lib/analytics';
import { BruteCard } from '@/components/BruteCard';
import { useThemeContext } from '@/components/ThemeProvider';
import styles from './ResumePage.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const RESUME_SKILL_CATEGORIES = [
  'languages',
  'backend',
  'frontend',
  'ai_automations',
  'data',
  'cloud_devops',
] as const;

export type ResumePageProps = { lang: Lang };

export function ResumePage({ lang }: ResumePageProps) {
  const [view, setView] = useState<'web' | 'pdf'>('web');
  const [pdfWidth, setPdfWidth] = useState<number>(0);
  const [pdfLoading, setPdfLoading] = useState(true);
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useThemeContext();
  const isNerv = theme === 'nerv';
  const primaryShade = isNerv ? 'evaGreen.4' : 'lclRust.5';

  const pdfRenderWidth = pdfWidth > 0 ? pdfWidth : undefined;

  useEffect(() => {
    if (view === 'pdf') setPdfLoading(true);
  }, [view]);

  useEffect(() => {
    if (view !== 'pdf') return;
    const el = pdfContainerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const updateWidth = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width) setPdfWidth(rect.width);
    };
    updateWidth();
    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(el);
    return () => observer.disconnect();
  }, [view]);

  return (
    <Box component="main" pt="md" pb="xl">
      <Container size="md">
        <Stack gap="lg">
          <Group justify="center">
            <Group gap={0}>
              <Button
                size="xs"
                variant={view === 'web' ? 'filled' : 'outline'}
                onClick={() => setView('web')}
                radius={0}
                color={view === 'web' ? primaryShade : 'dimmed'}
                style={{ borderWidth: 1 }}
              >
                web
              </Button>
              <Button
                size="xs"
                variant={view === 'pdf' ? 'filled' : 'outline'}
                onClick={() => setView('pdf')}
                radius={0}
                color={view === 'pdf' ? primaryShade : 'dimmed'}
                style={{ borderWidth: 1 }}
              >
                pdf
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
            <BruteCard>
              <Stack gap="xl">
                {/* Name and contact */}
                <Stack gap="xs" align="center" style={{ textAlign: 'center' }}>
                  <Text
                    size="lg"
                    fw={700}
                    c={primaryShade}
                    style={{ letterSpacing: '0.04em' }}
                  >
                    {contact.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {contact.location}
                  </Text>
                  <Group gap="sm" justify="center" wrap="wrap">
                    <Anchor href={`mailto:${contact.email}`} size="xs" c="dimmed">
                      {contact.email}
                    </Anchor>
                    <Anchor
                      href={`https://github.com/${contact.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="xs"
                      c="dimmed"
                      onClick={() => trackEvent('github')}
                    >
                      github
                    </Anchor>
                    <Anchor
                      href={`https://linkedin.com/in/${contact.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="xs"
                      c="dimmed"
                      onClick={() => trackEvent('linkedin')}
                    >
                      linkedin
                    </Anchor>
                  </Group>
                </Stack>
                <Divider color="dark.6" />

                {/* Summary */}
                <Stack gap="xs">
                  <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.06em' }}>
                    {'>'} {t(lang, 'resume.summary').toUpperCase()}
                  </Text>
                  <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                    {about.content[lang]}
                  </Text>
                </Stack>

                {/* Projects */}
                <Stack gap="xs">
                  <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.06em' }}>
                    {'>'} {t(lang, 'resume.projects').toUpperCase()}
                  </Text>
                  {resume_projects.map((project, i) => (
                    <Stack key={i} gap={4}>
                      <Anchor
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        fw={600}
                        size="sm"
                        c={primaryShade}
                        onClick={() =>
                          trackEvent('github_repo', { repo: project.name[lang] })
                        }
                      >
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

                {/* Skills */}
                <Stack gap="xs">
                  <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.06em' }}>
                    {'>'} {t(lang, 'resume.skills').toUpperCase()}
                  </Text>
                  {RESUME_SKILL_CATEGORIES.map((category) => {
                    const items = resume_skills[category];
                    if (!items?.length) return null;
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

                {/* Languages */}
                <Stack gap="xs">
                  <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.06em' }}>
                    {'>'} {t(lang, 'resume.languages_spoken').toUpperCase()}
                  </Text>
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
                  <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.06em' }}>
                    {'>'} {t(lang, 'resume.certifications').toUpperCase()}
                  </Text>
                  {certifications.map((cert, i) => (
                    <Stack key={i} gap={4}>
                      <Group justify="space-between" align="flex-start" wrap="wrap">
                        {cert.url ? (
                          <Anchor
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            fw={600}
                            size="sm"
                          >
                            {cert.name[lang]}
                          </Anchor>
                        ) : (
                          <Text fw={600} size="sm">
                            {cert.name[lang]}
                          </Text>
                        )}
                        <Text size="sm" c="dimmed">
                          {cert.issuer} ({cert.date})
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
                  <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.06em' }}>
                    {'>'} {t(lang, 'resume.education').toUpperCase()}
                  </Text>
                  {education.map((entry, i) => (
                    <Group key={i} justify="space-between" align="flex-start" wrap="wrap">
                      <Stack gap={2}>
                        <Text fw={600} size="sm">
                          {entry.degree[lang]}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {entry.level[lang]}
                        </Text>
                      </Stack>
                      <Stack gap={2} align="flex-end">
                        <Text size="sm" c="dimmed">
                          {entry.institution} ({entry.start_date} – {entry.end_date})
                        </Text>
                        <Text size="xs" c="dimmed">
                          {entry.location}
                        </Text>
                      </Stack>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </BruteCard>
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
          radius={0}
          style={{ width: 52, height: 52, padding: 0 }}
          onClick={() => trackEvent('resume_download')}
          color={primaryShade}
        >
          <IconFileDownload size={24} />
        </Button>
      </Box>
    </Box>
  );
}
