'use client';

import { AppShell, Box } from '@mantine/core';
import { FloatingNav } from './FloatingNav';
import styles from './SiteShell.module.css';

export type SiteShellProps = {
  children: React.ReactNode;
  lang: 'pt' | 'en';
};

export function SiteShell({ children, lang }: SiteShellProps) {
  return (
    <AppShell padding={0} header={{ height: 0 }}>
      <AppShell.Main className={styles.shell}>
        <div className={styles.backgroundTexture} aria-hidden="true">
          <span className={styles.textureGrain} />
          <span className={styles.printPlateBlue} />
          <span className={styles.printPlateOrange} />
        </div>
        <FloatingNav lang={lang} />
        <Box className={styles.content}>{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
