import { ProjectsPage } from '@/components/Projects/ProjectsPage';
import { getAlternates } from '@/config/seo';
import { en } from '@/data/i18n';

const locale = 'en';
const pathKey = 'projects';
const alternates = getAlternates(locale, pathKey);

export const metadata = {
  title: en.pages.projects,
  description: en.meta.description_projects,
  alternates: {
    canonical: alternates.canonical,
    languages: alternates.languages,
  },
  openGraph: {
    url: alternates.canonical,
    title: en.pages.projects,
    description: en.meta.description_projects,
  },
  twitter: {
    title: en.pages.projects,
    description: en.meta.description_projects,
  },
};

export default function ProjectsEn() {
  return <ProjectsPage lang="en" />;
}
