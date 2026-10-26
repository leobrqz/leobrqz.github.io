import { experience } from '@/data/experience';
import { type Lang } from '@/lib/i18n';
import styles from './HomePage.module.css';

export function ExperienceSection({ lang }: { lang: Lang }) {
  return (
    <section className={styles.section} id="experience" aria-labelledby="experience-title">
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle} id="experience-title">
          {lang === 'en' ? 'Experience' : 'Experiência'}
        </h2>
      </div>
      <div className={styles.experienceList}>
        {experience.map((item) => (
          <article className={styles.experienceItem} key={`${item.company}-${item.title.en}`}>
            <h3 className={styles.experienceRole}>{item.title[lang]}</h3>
            <span className={styles.experienceCompany}>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.company}
                </a>
              ) : (
                item.company
              )}
            </span>
            {item.period && <span className={styles.experiencePeriod}>{item.period[lang]}</span>}
            <span className={styles.experienceLocation}>{item.location}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
