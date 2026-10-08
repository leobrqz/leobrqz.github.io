'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { IconFileDownload } from '@tabler/icons-react';
import { Anchor, Box, Button, Container } from '@mantine/core';
import { Reveal } from '@/components/Design/Reveal';
import { CV_PDF_FILENAME, CV_PDF_URL } from '@/config/site';
import { contact } from '@/data';
import { trackEvent } from '@/lib/analytics';
import { type Lang } from '@/lib/i18n';
import { ResumeSections } from './ResumeSections';
import styles from './ResumePage.module.css';

const PdfResumeViewer = dynamic(
  () => import('./PdfResumeViewer').then((module) => module.PdfResumeViewer),
  { ssr: false }
);

export type ResumePageProps = { lang: Lang };

export function ResumePage({ lang }: ResumePageProps) {
  const [view, setView] = useState<'web' | 'pdf'>('web');

  const readViewFromUrl = useCallback(() => {
    setView(new URLSearchParams(window.location.search).get('view') === 'pdf' ? 'pdf' : 'web');
  }, []);

  useEffect(() => {
    readViewFromUrl();
    window.addEventListener('popstate', readViewFromUrl);
    return () => window.removeEventListener('popstate', readViewFromUrl);
  }, [readViewFromUrl]);

  const changeView = (nextView: 'web' | 'pdf') => {
    setView(nextView);
    const url = new URL(window.location.href);
    if (nextView === 'pdf') {
      url.searchParams.set('view', 'pdf');
    } else {
      url.searchParams.delete('view');
    }
    window.history.pushState({}, '', url);
  };

  return (
    <Box component="main" className={styles.resumeRoot}>
      <Container className={styles.resumeContainer}>
        <Reveal>
          <header className={styles.pageIntro}>
            <span className={styles.eyebrow}>
              02 / {lang === 'en' ? 'RESUME' : 'CURR\u00cdCULO'}
            </span>
            <h1>{lang === 'en' ? 'Resume' : 'Curr\u00edculo'}</h1>
            <div className={styles.introMeta}>
              <p>
                {contact.name}
                <br />
                {'Florian\u00f3polis, Santa Catarina'}
              </p>
              <Anchor href={`mailto:${contact.email}`} onClick={() => trackEvent('email')}>
                {contact.email}
              </Anchor>
            </div>
          </header>
        </Reveal>
        <div className={styles.toolbar}>
          <div
            className={styles.viewToggle}
            role="group"
            aria-label={lang === 'en' ? 'Resume format' : 'Formato do curr\u00edculo'}
          >
            <button type="button" aria-pressed={view === 'web'} onClick={() => changeView('web')}>
              {lang === 'en' ? 'WEB VIEW' : 'VERS\u00c3O WEB'}
            </button>
            <button type="button" aria-pressed={view === 'pdf'} onClick={() => changeView('pdf')}>
              {lang === 'en' ? 'PDF VIEW' : 'VER PDF'}
            </button>
          </div>
          <Button
            component="a"
            href={CV_PDF_URL}
            download={CV_PDF_FILENAME}
            className={styles.downloadButton}
            leftSection={<IconFileDownload size={17} />}
            onClick={() => trackEvent('resume_download')}
          >
            {lang === 'en' ? 'Download PDF' : 'Baixar PDF'}
          </Button>
        </div>
        {view === 'web' ? <ResumeSections lang={lang} /> : <PdfResumeViewer lang={lang} />}
      </Container>
    </Box>
  );
}
