import { ResumePage } from '@/components/Resume/ResumePage';
import { getAlternates } from '@/config/seo';
import { en } from '@/data/i18n';

const locale = 'en';
const pathKey = 'resume';
const alternates = getAlternates(locale, pathKey);

export const metadata = {
  title: en.pages.resume,
  description: en.meta.description_resume,
  alternates: {
    canonical: alternates.canonical,
    languages: alternates.languages,
  },
  openGraph: {
    url: alternates.canonical,
    title: en.pages.resume,
    description: en.meta.description_resume,
  },
  twitter: {
    title: en.pages.resume,
    description: en.meta.description_resume,
  },
};

export default function ResumeEn() {
  return <ResumePage lang="en" />;
}
