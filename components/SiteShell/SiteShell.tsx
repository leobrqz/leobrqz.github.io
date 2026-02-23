'use client';

import { AppShell, Box } from '@mantine/core';
import { IdeBackground } from '@/components/IdeBackground';
import { FloatingNav } from './FloatingNav';

export type SiteShellProps = {
  children: React.ReactNode;
  lang: 'pt' | 'en';
};

const CONTENT_TOP_PADDING = '4.5rem';

export function SiteShell({ children, lang }: SiteShellProps) {
  return (
    <AppShell padding={0} header={{ height: 0 }}>
      <AppShell.Main>
        <IdeBackground>
          <FloatingNav lang={lang} />
          <Box pt={CONTENT_TOP_PADDING}>{children}</Box>
        </IdeBackground>
      </AppShell.Main>
    </AppShell>
  );
}
