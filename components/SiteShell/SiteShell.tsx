'use client';

import { useEffect } from 'react';
import { FloatingNav } from './FloatingNav';
import styles from './SiteShell.module.css';

export type SiteShellProps = {
  children: React.ReactNode;
  lang: 'pt' | 'en';
};

export function SiteShell({ children, lang }: SiteShellProps) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className={styles.shell}>
      <div className={styles.backgroundTexture} aria-hidden="true" />
      <FloatingNav lang={lang} />
      <div className={styles.content}>{children}</div>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>© {new Date().getFullYear()} LEONARDO BRIQUEZI</span>
          <a className={styles.backToTop} href="#top">
            {lang === 'en' ? 'BACK TO TOP' : 'VOLTAR AO TOPO'} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
