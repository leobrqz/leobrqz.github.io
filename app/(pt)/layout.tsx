import { SiteShell } from '@/components/SiteShell';
import { SITE_TITLE } from '@/config/site';

export const metadata = {
  title: { default: SITE_TITLE, template: SITE_TITLE },
};

export default function PtLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="pt">{children}</SiteShell>;
}
