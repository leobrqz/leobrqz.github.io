import { HomePage } from '@/components/Home/HomePage';
import { getAlternates } from '@/config/seo';
import { pt } from '@/data/i18n';

const locale = 'pt';
const pathKey = 'home';
const alternates = getAlternates(locale, pathKey);

export const metadata = {
  title: pt.pages.home,
  description: pt.meta.description_home,
  alternates: {
    canonical: alternates.canonical,
    languages: alternates.languages,
  },
  openGraph: {
    url: alternates.canonical,
    title: pt.pages.home,
    description: pt.meta.description_home,
  },
  twitter: {
    title: pt.pages.home,
    description: pt.meta.description_home,
  },
};

export default function HomePt() {
  return <HomePage lang="pt" />;
}
