'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { IconFileDownload } from '@tabler/icons-react';
import {
  Anchor,
  Avatar,
  Box,
  Button,
  Container,
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

type TabKey = 'SUMMARY' | 'SKILLS' | 'PROJECTS' | 'CERTS' | 'EDU' | 'PDF';

const TABS: { key: TabKey; labelKey: string }[] = [
  { key: 'SUMMARY', labelKey: 'resume.summary' },
  { key: 'SKILLS', labelKey: 'resume.skills' },
  { key: 'PROJECTS', labelKey: 'resume.projects' },
  { key: 'CERTS', labelKey: 'resume.certifications' },
  { key: 'EDU', labelKey: 'resume.education' },
  { key: 'PDF', labelKey: 'resume.download_pdf' },
];

export type ResumePageProps = { lang: Lang };

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      style={{
        padding: '6px 14px',
        fontSize: 'var(--mantine-font-size-xs)',
        fontWeight: active ? 700 : 400,
        letterSpacing: '0.05em',
        border: '1px solid var(--mantine-color-dark-6)',
        borderBottom: active ? '2px solid' : '1px solid var(--mantine-color-dark-6)',
        borderColor: active ? 'var(--mantine-primary-color-4)' : undefined,
        backgroundColor: active ? 'var(--mantine-color-dark-8)' : 'transparent',
        color: active ? 'var(--mantine-primary-color-4)' : 'var(--mantine-color-dimmed)',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </Box>
  );
}

export function ResumePage({ lang }: ResumePageProps) {
  const [tab, setTab] = useState<TabKey>('SUMMARY');
  const [pdfWidth, setPdfWidth] = useState<number>(0);
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useThemeContext();
  const isNerv = theme === 'nerv';
  const primaryColor = isNerv ? '#87FF5F' : '#D4790A';

  useEffect(() => {
    if (tab !== 'PDF') return;
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
  }, [tab]);

  return (
    <Box component="main" pt="md" pb="xl">
      <Container size="md">
        <Stack gap="lg">
          {/* Personnel header */}
          <BruteCard>
            <Group wrap="wrap" justify="space-between">
              <Group gap="md">
                <Avatar src="/imgs/profile.jpg" size={56} radius={0} />
                <Box>
                  <Text size="sm" fw={700} c={primaryColor} style={{ letterSpacing: '0.04em' }}>
                    {contact.name}
                  </Text>
                  <Text size="xs" c="dimmed" style={{ letterSpacing: '0.03em' }}>
                    {t(lang, 'sidebar.role')} {'//'} {contact.location}
                  </Text>
                  <Group gap="sm" mt={4}>
                    <Anchor href={`mailto:${contact.email}`} size="xs" c="dimmed">
                      {contact.email}
                    </Anchor>
                    <Text size="xs" c="dimmed">|</Text>
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
                    <Text size="xs" c="dimmed">|</Text>
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
                </Box>
              </Group>
            </Group>
          </BruteCard>

          {/* Tab bar */}
          <Group gap={0} wrap="wrap">
            {TABS.map((tabItem) => (
              <TabButton
                key={tabItem.key}
                active={tab === tabItem.key}
                onClick={() => setTab(tabItem.key)}
                label={t(lang, tabItem.labelKey).toUpperCase()}
              />
            ))}
          </Group>

          {/* Tab content */}
          <BruteCard style={{ minHeight: 300 }}>
            {tab === 'SUMMARY' && (
              <Stack gap="md">
                <Text size="xs" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  {'>'} BRIEFING
                </Text>
                <Text size="sm" style={{ whiteSpace: 'pre-line', letterSpacing: '0.02em' }}>
                  {about.content[lang]}
                </Text>
                <Text size="xs" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  {'>'} {t(lang, 'resume.languages_spoken').toUpperCase()}
                </Text>
                <Group gap="xl">
                  {languages_spoken.map((entry, i) => (
                    <Text key={i} size="sm" c="dimmed">
                      {entry.name[lang]} ({entry.level[lang]})
                    </Text>
                  ))}
                </Group>
              </Stack>
            )}

            {tab === 'SKILLS' && (
              <Stack gap="md">
                <Text size="xs" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  {'>'} PROFICIENCY MATRIX
                </Text>
                {RESUME_SKILL_CATEGORIES.map((category) => {
                  const items = resume_skills[category];
                  if (!items?.length) return null;
                  return (
                    <Box key={category}>
                      <Text size="xs" fw={700} c={primaryColor} mb={4} style={{ letterSpacing: '0.04em' }}>
                        {t(lang, `resume_labels.${category}`).toUpperCase()}
                      </Text>
                      <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {items.map((item) => (
                          <Box
                            key={item.name}
                            style={{
                              padding: '3px 8px',
                              border: '1px solid var(--mantine-color-dark-6)',
                              fontSize: 'var(--mantine-font-size-xs)',
                              letterSpacing: '0.03em',
                            }}
                          >
                            {item.name}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            )}

            {tab === 'PROJECTS' && (
              <Stack gap="md">
                <Text size="xs" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  {'>'} OPERATIONS LOG
                </Text>
                {resume_projects.map((project, i) => (
                  <Box key={i}>
                    <Anchor
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      fw={600}
                      size="sm"
                      c={primaryColor}
                      onClick={() =>
                        trackEvent('github_repo', { repo: project.name[lang] })
                      }
                    >
                      {project.name[lang]}
                    </Anchor>
                    <Text size="xs" c="dimmed" mb={4}>
                      {project.technologies.join(' · ')}
                    </Text>
                    <Text size="sm" style={{ whiteSpace: 'pre-line', letterSpacing: '0.02em' }}>
                      {project.description[lang]}
                    </Text>
                  </Box>
                ))}
              </Stack>
            )}

            {tab === 'CERTS' && (
              <Stack gap="md">
                <Text size="xs" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  {'>'} CLEARANCE CERTIFICATIONS
                </Text>
                {certifications.map((cert, i) => (
                  <Box key={i}>
                    <Group justify="space-between" wrap="wrap" mb={4}>
                      {cert.url ? (
                        <Anchor
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          fw={600}
                          size="sm"
                          c={primaryColor}
                        >
                          {cert.name[lang]}
                        </Anchor>
                      ) : (
                        <Text fw={600} size="sm">
                          {cert.name[lang]}
                        </Text>
                      )}
                      <Text size="xs" c="dimmed">
                        {cert.issuer} ({cert.date})
                      </Text>
                    </Group>
                    <Text size="sm" style={{ whiteSpace: 'pre-line', letterSpacing: '0.02em' }}>
                      {cert.description[lang]}
                    </Text>
                  </Box>
                ))}
              </Stack>
            )}

            {tab === 'EDU' && (
              <Stack gap="md">
                <Text size="xs" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  {'>'} ACADEMIC RECORD
                </Text>
                {education.map((entry, i) => (
                  <Box key={i}>
                    <Text fw={600} size="sm">
                      {entry.degree[lang]}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {entry.institution} {'//'} {entry.location} {'//'} {entry.start_date} – {entry.end_date}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {entry.level[lang]}
                    </Text>
                  </Box>
                ))}
              </Stack>
            )}

            {tab === 'PDF' && (
              <Box className={styles.pdfViewer} style={{ width: '100%' }}>
                <Box
                  ref={pdfContainerRef}
                  style={{
                    width: '100%',
                    minHeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Document file={CV_PDF_URL}>
                    <Page
                      pageNumber={1}
                      width={pdfWidth > 0 ? pdfWidth : undefined}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                </Box>
              </Box>
            )}
          </BruteCard>
        </Stack>
      </Container>

      <Box
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
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
          size="sm"
          radius={0}
          onClick={() => trackEvent('resume_download')}
          color={isNerv ? 'evaGreen.4' : 'lclRust.5'}
          leftSection={<IconFileDownload size={16} />}
        >
          EXPORT.PDF
        </Button>
      </Box>
    </Box>
  );
}
