import { skills, type SkillItem } from '@/data/skills';
import { t, type Lang } from '@/lib/i18n';
import { SkillIcon } from './SkillIcon';
import styles from './HomePage.module.css';
import skillStyles from './SkillsSection.module.css';

const CATEGORIES = [
  'languages',
  'backend',
  'frontend',
  'ai_automations',
  'data',
  'cloud_devops',
] as const;

export function SkillsSection({ lang }: { lang: Lang }) {
  return (
    <section className={styles.section} id="skills" aria-labelledby="skills-title">
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle} id="skills-title">
          {t(lang, 'sections.skills')}
        </h2>
      </div>
      <div className={skillStyles.skillsGrid}>
        {CATEGORIES.map((category) => (
          <div className={skillStyles.skillGroup} key={category}>
            <h3 className={skillStyles.skillGroupTitle}>{t(lang, `skills.${category}`)}</h3>
            <div className={skillStyles.skillNames}>
              {(skills[category] as SkillItem[]).map((skill) => (
                <span className={skillStyles.skill} key={skill.name}>
                  <SkillIcon skill={skill} />
                  <span>{skill.name}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
