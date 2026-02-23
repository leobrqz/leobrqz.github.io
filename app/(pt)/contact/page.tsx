import { ContactPage } from '@/components/Contact/ContactPage';
import { getAlternates } from '@/config/seo';
import { pt } from '@/data/i18n';

const locale = 'pt';
const pathKey = 'contact';
const alternates = getAlternates(locale, pathKey);

export const metadata = {
  title: pt.pages.contact,
  description: pt.meta.description_contact,
  alternates: {
    canonical: alternates.canonical,
    languages: alternates.languages,
  },
  openGraph: {
    url: alternates.canonical,
    title: pt.pages.contact,
    description: pt.meta.description_contact,
  },
  twitter: {
    title: pt.pages.contact,
    description: pt.meta.description_contact,
  },
};

export default function ContactPt() {
  return <ContactPage lang="pt" />;
}
