'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { IconArrowUpRight } from '@tabler/icons-react';
import { Box } from '@mantine/core';
import { type Lang } from '@/lib/i18n';
import styles from './ProjectsPage.module.css';

type State = { status: 'idle' | 'loading' | 'none' | 'error' } | { status: 'html'; html: string };

export function ProjectReadme({
  projectName,
  state,
  lang,
  onToggle,
}: {
  projectName: string;
  state: State;
  lang: Lang;
  onToggle: (name: string, show: boolean) => void;
}) {
  const panelId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const [imageFailure, setImageFailure] = useState(false);
  const open = state.status !== 'idle';

  useEffect(() => {
    setImageFailure(false);
    const images = wrapper.current?.querySelectorAll('img');
    if (!images) {
      return;
    }
    const handleError = () => setImageFailure(true);
    images.forEach((image) => image.addEventListener('error', handleError));
    if (Array.from(images).some((image) => image.complete && image.naturalWidth === 0)) {
      setImageFailure(true);
    }
    return () => images.forEach((image) => image.removeEventListener('error', handleError));
  }, [state]);

  return (
    <>
      <button
        type="button"
        className={styles.readmeButton}
        aria-expanded={open}
        aria-controls={panelId}
        disabled={state.status === 'loading'}
        onClick={() => onToggle(projectName, !open)}
      >
        <span>
          {state.status === 'loading'
            ? lang === 'en'
              ? 'Loading README...'
              : 'Carregando README...'
            : open
              ? lang === 'en'
                ? 'Hide README'
                : 'Ocultar README'
              : lang === 'en'
                ? 'Show README'
                : 'Mostrar README'}
        </span>
        <IconArrowUpRight size={16} className={open ? styles.rotateIcon : ''} />
      </button>
      <div className={styles.readmePanel} id={panelId} aria-live="polite" hidden={!open}>
        {open && (
          <>
            {state.status === 'html' && (
              <Box
                ref={wrapper}
                className={`${styles.readmeWrapper} markdown-body`}
                dangerouslySetInnerHTML={{ __html: state.html }}
              />
            )}
            {imageFailure && (
              <p className={styles.readmeMessage}>
                {lang === 'en'
                  ? 'Some README images could not be loaded.'
                  : 'Algumas imagens do README não puderam ser carregadas.'}
              </p>
            )}
            {state.status === 'none' && (
              <div className={styles.readmeNotice}>
                <p className={styles.readmeMessage}>
                  {lang === 'en'
                    ? 'No README is available for this repository.'
                    : 'Este repositório não possui um README disponível.'}
                </p>
                <button
                  type="button"
                  className={styles.readmeRetry}
                  onClick={() => onToggle(projectName, true)}
                >
                  {lang === 'en' ? 'Try again' : 'Tentar novamente'}
                </button>
              </div>
            )}
            {state.status === 'error' && (
              <div className={styles.readmeNotice}>
                <p className={styles.readmeMessage}>
                  {lang === 'en'
                    ? 'The README could not be loaded. Try again.'
                    : 'Não foi possível carregar o README. Tente novamente.'}
                </p>
                <button
                  type="button"
                  className={styles.readmeRetry}
                  onClick={() => onToggle(projectName, true)}
                >
                  {lang === 'en' ? 'Retry' : 'Tentar novamente'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
