import { ContactPage } from '@/components/Contact/ContactPage';
import { pt } from '@/data/i18n';

export const metadata = { title: pt.pages.contact };

export default function ContactPt() {
  return <ContactPage lang="pt" />;
}
