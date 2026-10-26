'use client';

import { IconArrowUpRight } from '@tabler/icons-react';
import { contact } from '@/data/contact';
import { trackEvent } from '@/lib/analytics';
import { type Lang } from '@/lib/i18n';
import styles from './HomePage.module.css';

export function ContactInvitation({ lang }: { lang: Lang }) {
  return (
    <section className={styles.contactInvitation} id="contact" aria-labelledby="contact-title">
      <div className={`${styles.sectionHead} ${styles.contactHead}`}>
        <h2 className={styles.sectionTitle} id="contact-title">
          {lang === 'en' ? 'Contact' : 'Contato'}
        </h2>
        <a
          className={styles.contactAction}
          href={`mailto:${contact.email}`}
          onClick={() => trackEvent('email')}
        >
          {lang === 'en' ? 'Send an email' : 'Enviar email'}
          <IconArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
