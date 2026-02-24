'use client';

import { usePathname } from 'next/navigation';
import { SiteShell } from './SiteShell';

export function SiteShellWithLang({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lang = pathname?.startsWith('/en') ? 'en' : 'pt';
  return <SiteShell lang={lang}>{children}</SiteShell>;
}
