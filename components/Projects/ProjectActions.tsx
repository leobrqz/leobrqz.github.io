'use client';

import { useEffect, useState } from 'react';
import { IconArrowUpRight, IconDownload } from '@tabler/icons-react';
import { detectBrowserFamily, type BrowserFamily } from '@/lib/browser';
import { type Lang } from '@/lib/i18n';
import styles from './ProjectActions.module.css';

const LYRICS_REPOSITORY = 'LyricsExtension';
const REMOTE_CONTROL_REPOSITORY = 'OpenRemoteControl';
const LYRICS_INSTALL_URL = 'https://addons.mozilla.org/en-US/firefox/addon/lyrics-please/';
const REMOTE_CONTROL_RELEASES_URL = 'https://github.com/leobrqz/OpenRemoteControl/releases';

export function ProjectActions({
  repoName,
  lang,
  variant = 'default',
}: {
  repoName: string;
  lang: Lang;
  variant?: 'default' | 'side';
}) {
  const [browser, setBrowser] = useState<BrowserFamily | null>(null);
  const actionsClassName = `${styles.actions} ${variant === 'side' ? styles.sideActions : ''}`;

  useEffect(() => {
    setBrowser(detectBrowserFamily(navigator.userAgent, navigator.platform));
  }, []);

  if (repoName === LYRICS_REPOSITORY) {
    const message =
      browser === 'chrome'
        ? lang === 'en'
          ? 'Unfortunately, the extension is not available for Chrome yet.'
          : 'Infelizmente, a extensão ainda não está disponível para o Chrome.'
        : lang === 'en'
          ? 'Available for Firefox.'
          : 'Disponível para Firefox.';

    return (
      <div className={actionsClassName} aria-live="polite">
        {browser === 'firefox' ? (
          <a
            className={styles.actionLink}
            href={LYRICS_INSTALL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconDownload size={18} aria-hidden="true" />
            {lang === 'en' ? 'Install for Firefox' : 'Instalar no Firefox'}
            <IconArrowUpRight size={18} aria-hidden="true" />
          </a>
        ) : (
          <p className={styles.actionNote}>{message}</p>
        )}
      </div>
    );
  }

  if (repoName === REMOTE_CONTROL_REPOSITORY) {
    return (
      <div className={actionsClassName}>
        <a
          className={styles.actionLink}
          href={REMOTE_CONTROL_RELEASES_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconDownload size={18} aria-hidden="true" />
          Download
          <IconArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    );
  }

  return null;
}
