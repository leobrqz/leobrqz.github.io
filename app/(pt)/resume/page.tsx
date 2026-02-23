import { ResumePage } from '@/components/Resume/ResumePage';
import { getAlternates } from '@/config/seo';
import { pt } from '@/data/i18n';

const locale = 'pt';
const pathKey = 'resume';
const alternates = getAlternates(locale, pathKey);

export const metadata = {
  title: pt.pages.resume,
  description: pt.meta.description_resume,
  alternates: {
    canonical: alternates.canonical,
    languages: alternates.languages,
  },
  openGraph: {
    url: alternates.canonical,
    title: pt.pages.resume,
    description: pt.meta.description_resume,
  },
  twitter: {
    title: pt.pages.resume,
    description: pt.meta.description_resume,
  },
};

export default function ResumePt() {
  return <ResumePage lang="pt" />;
}
