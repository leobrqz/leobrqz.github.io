import { SiteShell } from '@/components/SiteShell';
import { SITE_TITLE } from '@/config/site';

export const metadata = {
  title: { template: `%s | ${SITE_TITLE}` },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
