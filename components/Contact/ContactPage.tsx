'use client';

import Link from 'next/link';
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
} from '@tabler/icons-react';
import { Anchor, Box, Container } from '@mantine/core';
import { Reveal } from '@/components/Design/Reveal';
import { contact } from '@/data';
import { trackEvent } from '@/lib/analytics';
import { t, type Lang } from '@/lib/i18n';
import { ContactGame } from './ContactGame';
import styles from './ContactPage.module.css';

export type ContactPageProps = { lang: Lang };

const LINKS = [
  {
    key: 'email',
    label: 'Email',
    value: contact.email,
    href: `mailto:${contact.email}`,
    icon: IconMail,
  },
  {
    key: 'github',
    label: 'GitHub',
    value: `github.com/${contact.github}`,
    href: `https://github.com/${contact.github}`,
    icon: IconBrandGithub,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    value: `linkedin.com/in/${contact.linkedin}`,
    href: `https://linkedin.com/in/${contact.linkedin}`,
    icon: IconBrandLinkedin,
  },
] as const;

export function ContactPage({ lang }: ContactPageProps) {
  const homeHref = lang === 'en' ? '/en' : '/';

  return (
    <Box component="main" className={styles.contactPage}>
      <Container className={styles.contactContainer}>
        <Reveal>
          <header className={styles.contactIntro}>
            <span className={styles.eyebrow}>03 / {lang === 'en' ? 'CONTACT' : 'CONTATO'}</span>
            <h1>{lang === 'en' ? 'Contact' : 'Contato'}</h1>
            <p>
              {lang === 'en'
                ? "Have a project, opportunity or idea to discuss? I'd be glad to hear from you."
                : 'Para falar sobre um projeto, uma oportunidade ou c\u00f3digo, me encontre por aqui.'}
            </p>
            <Anchor
              className={styles.emailFeature}
              href={`mailto:${contact.email}`}
              onClick={() => trackEvent('email')}
            >
              {contact.email}
              <IconArrowUpRight size={21} />
            </Anchor>
          </header>
        </Reveal>
        <div className={styles.contactRule}>
          <span>{lang === 'en' ? 'ELSEWHERE ON THE WEB' : 'TAMB\u00c9M NA WEB'}</span>
        </div>
        <nav className={styles.contactLinks} aria-label={t(lang, 'contact.connect_with_me')}>
          {LINKS.map(({ key, label, value, href, icon: Icon }, index) => (
            <Anchor
              key={key}
              href={href}
              target={key === 'email' ? undefined : '_blank'}
              rel={key === 'email' ? undefined : 'noopener noreferrer'}
              className={styles.contactLink}
              onClick={() =>
                key === 'github'
                  ? trackEvent('github')
                  : key === 'linkedin'
                    ? trackEvent('linkedin')
                    : trackEvent('email')
              }
            >
              <span className={styles.linkIndex}>{String(index + 1).padStart(2, '0')}</span>
              <Icon className={styles.linkIcon} size={20} stroke={1.5} />
              <span className={styles.linkCopy}>
                <strong>{key === 'email' ? t(lang, 'contact.send_email') : label}</strong>
                <small>{value}</small>
              </span>
              <IconArrowUpRight className={styles.linkArrow} size={19} />
            </Anchor>
          ))}
        </nav>
        <ContactGame lang={lang} />
        <div className={styles.contactFooter}>
          <Anchor component={Link} href={homeHref} underline="never">
            {lang === 'en' ? 'Back home' : 'Voltar ao in\u00edcio'}
          </Anchor>
        </div>
      </Container>
    </Box>
  );
}
