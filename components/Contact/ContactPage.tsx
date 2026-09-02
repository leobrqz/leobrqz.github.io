'use client';

import Link from 'next/link';
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
} from '@tabler/icons-react';
import { Anchor, Box, Container } from '@mantine/core';
import { contact } from '@/data';
import { trackEvent } from '@/lib/analytics';
import { t, type Lang } from '@/lib/i18n';
import styles from './ContactPage.module.css';

export type ContactPageProps = {
  lang: Lang;
};

const LINKS = [
  { key: 'github', label: 'GitHub', icon: IconBrandGithub },
  { key: 'linkedin', label: 'LinkedIn', icon: IconBrandLinkedin },
  { key: 'email', label: 'Email', icon: IconMail },
] as const;

export function ContactPage({ lang }: ContactPageProps) {
  const homeHref = lang === 'en' ? '/en' : '/';

  return (
    <Box component="main" className={styles.contactPage}>
      <Container size="lg" className={styles.contactContainer}>
        <div className={styles.contactGrid}>
          <div className={styles.contactIntro}>
            <span className={styles.eyebrow}>{lang === 'en' ? 'CONTACT' : 'CONTATO'}</span>
            <h1>{t(lang, 'contact.get_in_touch')}</h1>
            <p>
              {lang === 'en'
                ? 'For a project, an opportunity or a good conversation about code, find me here.'
                : 'Para falar sobre um projeto, uma oportunidade ou código, me encontre por aqui.'}
            </p>
          </div>

          <nav className={styles.contactLinks} aria-label={t(lang, 'contact.connect_with_me')}>
            {LINKS.map(({ key, label, icon: Icon }) => {
              const href =
                key === 'github'
                  ? `https://github.com/${contact.github}`
                  : key === 'linkedin'
                    ? `https://linkedin.com/in/${contact.linkedin}`
                    : `mailto:${contact.email}`;
              const text = key === 'email' ? t(lang, 'contact.send_email') : label;

              return (
                <Anchor
                  key={key}
                  href={href}
                  target={key === 'email' ? undefined : '_blank'}
                  rel={key === 'email' ? undefined : 'noopener noreferrer'}
                  className={styles.contactLink}
                  onClick={() =>
                    key !== 'email' && trackEvent(key === 'github' ? 'github' : 'linkedin')
                  }
                >
                  <span className={styles.linkIcon}>
                    <Icon size={20} stroke={1.6} />
                  </span>
                  <span className={styles.linkCopy}>
                    <strong>{text}</strong>
                    <small>
                      {key === 'email'
                        ? contact.email
                        : `/${key === 'github' ? contact.github : contact.linkedin}`}
                    </small>
                  </span>
                  <IconArrowUpRight className={styles.linkArrow} size={19} />
                </Anchor>
              );
            })}
          </nav>
        </div>

        <footer className={styles.contactFooter}>
          <span>{contact.location}</span>
          <Anchor component={Link} href={homeHref} underline="never">
            ← {lang === 'en' ? 'Back home' : 'Voltar ao início'}
          </Anchor>
        </footer>
      </Container>
    </Box>
  );
}
