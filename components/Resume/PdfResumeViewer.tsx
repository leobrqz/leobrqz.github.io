'use client';

import { useEffect, useRef, useState } from 'react';
import { IconRefresh } from '@tabler/icons-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { CV_PDF_URL } from '@/config/site';
import { type Lang } from '@/lib/i18n';
import styles from './ResumePage.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/documents/pdf.worker-5.4.296.min.mjs';
export function PdfResumeViewer({ lang }: { lang: Lang }) {
  const host = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [pages, setPages] = useState(0);
  useEffect(() => {
    const element = host.current;
    if (!element) {
      return;
    }

    const measure = () => {
      const nextWidth = element.getBoundingClientRect().width;
      if (nextWidth > 0) {
        setWidth(nextWidth);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(element);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  const retry = () => {
    setStatus('loading');
    setAttempt((n) => n + 1);
  };
  return (
    <div className={styles.pdfViewer}>
      <div className={styles.pdfHost} ref={host}>
        {status === 'loading' && (
          <p className={styles.pdfStatus} role="status">
            {lang === 'en' ? 'Loading PDF...' : 'Carregando o PDF…'}
          </p>
        )}
        {status === 'error' && (
          <div className={styles.pdfStatus} role="alert">
            <p>
              {lang === 'en' ? 'The PDF could not be displayed.' : 'Não foi possível exibir o PDF.'}
            </p>
            <button type="button" onClick={retry}>
              <IconRefresh size={15} />
              {lang === 'en' ? 'Retry' : 'Tentar novamente'}
            </button>
          </div>
        )}
        <Document
          key={attempt}
          file={CV_PDF_URL}
          onLoadSuccess={({ numPages }) => {
            setPages(numPages);
            setStatus('ready');
          }}
          onLoadError={() => setStatus('error')}
          loading={null}
          error={null}
        >
          {status !== 'error' &&
            width > 0 &&
            Array.from({ length: pages }, (_, index) => (
              <Page
                key={`${attempt}-${index}`}
                pageNumber={index + 1}
                width={Math.min(width, 920)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
        </Document>
      </div>
    </div>
  );
}
