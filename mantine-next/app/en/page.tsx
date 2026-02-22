import { HomePage } from '../../components/Home/HomePage';
import { en } from '../../data/i18n';

export const metadata = { title: en.pages.home };

export default function HomeEn() {
  return <HomePage lang="en" />;
}
