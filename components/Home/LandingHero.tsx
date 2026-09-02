'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { Anchor, Text } from '@mantine/core';
import { about } from '@/data/about';
import { contact } from '@/data/contact';
import { t, type Lang } from '@/lib/i18n';
import styles from './HomePage.module.css';

export type LandingHeroProps = {
  lang: Lang;
};

const FIRST_NAME = 'Leonardo';
const LAST_NAME = 'Briquezi';
const NAME_LENGTH = FIRST_NAME.length + LAST_NAME.length;

export function LandingHero({ lang }: LandingHeroProps) {
  const [typedLength, setTypedLength] = useState(0);
  const projectsHref = lang === 'en' ? '/en/projects' : '/projects';
  const resumeHref = lang === 'en' ? '/en/resume' : '/resume';

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setTypedLength(NAME_LENGTH);
      return undefined;
    }

    const interval = window.setInterval(() => {
      setTypedLength((current) => {
        if (current >= NAME_LENGTH) {
          window.clearInterval(interval);
          return current;
        }
        return current + 1;
      });
    }, 74);

    return () => window.clearInterval(interval);
  }, []);

  const firstName = FIRST_NAME.slice(0, Math.min(typedLength, FIRST_NAME.length));
  const lastName = typedLength > FIRST_NAME.length
    ? LAST_NAME.slice(0, typedLength - FIRST_NAME.length)
    : '';
  const typingLastName = typedLength > FIRST_NAME.length;

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroMain}>
        <Text className={styles.eyebrow}>{t(lang, 'home.intro_kicker')}</Text>
        <h1 id="hero-title" className={styles.heroTitle} aria-label="Leonardo Briquezi">
          <span className={styles.heroNameLine}>
            {firstName}
            {!typingLastName && <span className={styles.typingCursor} aria-hidden="true" />}
          </span>
          <span className={styles.heroNameAccent}>
            {lastName}
            {typingLastName && <span className={styles.typingCursor} aria-hidden="true" />}
          </span>
        </h1>
        <p className={styles.heroRole}>
          {t(lang, 'sidebar.role')} <span aria-hidden="true">·</span> {t(lang, 'sidebar.education')}
        </p>
        <p className={styles.heroSummary}>{about.home_content[lang]}</p>
        <div className={styles.heroActions}>
          <Anchor component={Link} href={projectsHref} className={styles.primaryAction} underline="never">
            {t(lang, 'home.view_projects')} <IconArrowUpRight size={17} />
          </Anchor>
          <Anchor component={Link} href={resumeHref} className={styles.secondaryAction} underline="never">
            {t(lang, 'home.view_resume')} <IconArrowDownRight size={16} />
          </Anchor>
        </div>
      </div>

      <aside className={styles.heroAside} aria-label="Profile details">
        <div className={styles.heroAsideTop}>
          <span className={styles.asideCode}>LB / 2026</span>
          <span className={styles.asideRule} />
        </div>
        <dl className={styles.heroFacts}>
          <div>
            <dt>{lang === 'en' ? 'Based in' : 'Baseado em'}</dt>
            <dd>{contact.location}</dd>
          </div>
          <div>
            <dt>{lang === 'en' ? 'Focus' : 'Foco'}</dt>
            <dd>Backend · IA · Produto</dd>
          </div>
          <div>
            <dt>{lang === 'en' ? 'Links' : 'Links'}</dt>
            <dd>GitHub · LinkedIn</dd>
          </div>
        </dl>
        <span className={styles.asideArrow} aria-hidden="true">↘</span>
      </aside>
    </section>
  );
}
