import { ContactPage } from '../../../components/Contact/ContactPage';
import { en } from '../../../data/i18n';

export const metadata = { title: en.pages.contact };

export default function ContactEn() {
  return <ContactPage lang="en" />;
}
