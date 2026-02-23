import { ProjectsPage } from '@/components/Projects/ProjectsPage';
import { getAlternates } from '@/config/seo';
import { pt } from '@/data/i18n';

const locale = 'pt';
const pathKey = 'projects';
const alternates = getAlternates(locale, pathKey);

export const metadata = {
  title: pt.pages.projects,
  description: pt.meta.description_projects,
  alternates: {
    canonical: alternates.canonical,
    languages: alternates.languages,
  },
  openGraph: {
    url: alternates.canonical,
    title: pt.pages.projects,
    description: pt.meta.description_projects,
  },
  twitter: {
    title: pt.pages.projects,
    description: pt.meta.description_projects,
  },
};

export default function ProjectsPt() {
  return <ProjectsPage lang="pt" />;
}
