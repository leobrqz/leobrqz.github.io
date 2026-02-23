import { HomePage } from '@/components/Home/HomePage';
import { getAlternates } from '@/config/seo';
import { en } from '@/data/i18n';

const locale = 'en';
const pathKey = 'home';
const alternates = getAlternates(locale, pathKey);

export const metadata = {
  title: en.pages.home,
  description: en.meta.description_home,
  alternates: {
    canonical: alternates.canonical,
    languages: alternates.languages,
  },
  openGraph: {
    url: alternates.canonical,
    title: en.pages.home,
    description: en.meta.description_home,
  },
  twitter: {
    title: en.pages.home,
    description: en.meta.description_home,
  },
};

export default function HomeEn() {
  return <HomePage lang="en" />;
}
