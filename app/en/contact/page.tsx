import { ContactPage } from '@/components/Contact/ContactPage';
import { getAlternates } from '@/config/seo';
import { en } from '@/data/i18n';

const locale = 'en';
const pathKey = 'contact';
const alternates = getAlternates(locale, pathKey);

export const metadata = {
  title: en.pages.contact,
  description: en.meta.description_contact,
  alternates: {
    canonical: alternates.canonical,
    languages: alternates.languages,
  },
  openGraph: {
    url: alternates.canonical,
    title: en.pages.contact,
    description: en.meta.description_contact,
  },
  twitter: {
    title: en.pages.contact,
    description: en.meta.description_contact,
  },
};

export default function ContactEn() {
  return <ContactPage lang="en" />;
}
