import { ProjectsPage } from '../../../components/Projects/ProjectsPage';
import { en } from '../../../data/i18n';

export const metadata = { title: en.pages.projects };

export default function ProjectsEn() {
  return <ProjectsPage lang="en" />;
}
