import Image from 'next/image';
import { about } from '@/data/about';
import { contact } from '@/data/contact';
import { t, type Lang } from '@/lib/i18n';
import styles from './HomePage.module.css';

export function AboutSection({ lang }: { lang: Lang }) {
  return (
    <section className={styles.section} id="about" aria-labelledby="about-title">
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle} id="about-title">
          {t(lang, 'sections.about_me')}
        </h2>
      </div>
      <div className={styles.aboutGrid}>
        <Image
          className={styles.portrait}
          src="/imgs/profile.jpg"
          alt={contact.name}
          width={102}
          height={102}
          unoptimized
        />
        <p className={styles.aboutCopy}>{about.home_profile[lang]}</p>
        <div className={styles.aboutMeta}>
          <span>{contact.location}</span>
          <span>
            {lang === 'en' ? 'Computer Science student' : 'Estudante de Ciência da Computação'}
          </span>
          <span>Python · TypeScript · React · Next.js</span>
        </div>
      </div>
    </section>
  );
}
