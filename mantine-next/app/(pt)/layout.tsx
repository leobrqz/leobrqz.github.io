import { SiteShell } from '../../components/SiteShell';
import { SITE_TITLE } from '../../config/site';

export const metadata = {
  title: { template: `%s | ${SITE_TITLE}` },
};

export default function PtLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="pt">{children}</SiteShell>;
}
