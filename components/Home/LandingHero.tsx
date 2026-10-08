'use client';

import Link from 'next/link';
import {
  IconArrowDownRight,
  IconArrowRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconMapPin,
} from '@tabler/icons-react';
import { about } from '@/data/about';
import { contact } from '@/data/contact';
import { trackEvent } from '@/lib/analytics';
import { t, type Lang } from '@/lib/i18n';
import styles from './HomePage.module.css';

export function LandingHero({ lang }: { lang: Lang }) {
  const resumeHref = lang === 'en' ? '/en/resume' : '/resume';
  const resumePdfHref = `${resumeHref}?view=pdf`;
  const projectsHref = lang === 'en' ? '/en/projects' : '/projects';
  const contacts = [
    {
      label: contact.location,
      href: undefined,
      icon: IconMapPin,
      onClick: undefined,
    },
    {
      label: contact.email,
      href: `mailto:${contact.email}`,
      icon: IconMail,
      onClick: () => trackEvent('email'),
    },
    {
      label: `github.com/${contact.github}`,
      href: `https://github.com/${contact.github}`,
      icon: IconBrandGithub,
      onClick: () => trackEvent('github'),
    },
    {
      label: `linkedin.com/in/${contact.linkedin}`,
      href: `https://linkedin.com/in/${contact.linkedin}`,
      icon: IconBrandLinkedin,
      onClick: () => trackEvent('linkedin'),
    },
  ];

  return (
    <section className={styles.hero} id="home" aria-labelledby="hero-title">
      <div className={styles.heroMain}>
        <p className={styles.eyebrow}>{t(lang, 'home.intro_kicker')}</p>
        <h1 id="hero-title" className={styles.heroTitle} aria-label="Leonardo Briquezi">
          <span className={styles.heroNameLine}>Leonardo</span>
          <span>Briquezi</span>
        </h1>
        <p className={styles.heroSummary}>{about.home_content[lang]}</p>
        <div className={styles.heroActions}>
          <Link className={`${styles.action} ${styles.primaryAction}`} href={projectsHref}>
            {t(lang, 'home.view_projects')} <IconArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link className={`${styles.action} ${styles.secondaryAction}`} href={resumeHref}>
            {lang === 'en' ? 'Resume' : 'Currículo'}
            <IconArrowDownRight size={16} aria-hidden="true" />
          </Link>
          <Link className={styles.pdfLink} href={resumePdfHref}>
            {lang === 'en' ? 'View PDF' : 'Ver PDF'}
            <IconArrowDownRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <aside
        className={styles.heroAside}
        aria-label={lang === 'en' ? 'Contact details' : 'Dados de contato'}
      >
        <div className={styles.heroAsideTop}>
          <span className={styles.sectionIndex}>{lang === 'en' ? 'Contact' : 'Contato'}</span>
          <span className={styles.asideRule} />
        </div>
        <div className={styles.contactList}>
          {contacts.map(({ label, href, icon: Icon, onClick }) => {
            const content = (
              <>
                <Icon className={styles.contactIcon} size={18} stroke={1.6} aria-hidden="true" />
                <span>{label}</span>
              </>
            );

            return href ? (
              <a
                className={styles.contactLink}
                href={href}
                key={label}
                onClick={onClick}
                target={href.startsWith('https:') ? '_blank' : undefined}
                rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}
              >
                {content}
              </a>
            ) : (
              <span className={styles.contactLink} key={label}>
                {content}
              </span>
            );
          })}
        </div>
      </aside>
    </section>
  );
}
