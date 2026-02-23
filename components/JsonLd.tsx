import { contact } from '@/data/contact';
import { en } from '@/data/i18n';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: contact.name,
  url: contact.portfolio,
  jobTitle: en.sidebar.role,
  sameAs: [
    `https://github.com/${contact.github}`,
    `https://linkedin.com/in/${contact.linkedin}`,
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
    />
  );
}
