import { SiteShell } from '@/components/SiteShell';
import { SITE_TITLE } from '@/config/site';

export const metadata = {
  title: { default: SITE_TITLE, template: SITE_TITLE },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
