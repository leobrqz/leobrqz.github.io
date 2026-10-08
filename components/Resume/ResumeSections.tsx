'use client';

import { Anchor } from '@mantine/core';
import {
  about,
  certifications,
  contact,
  education,
  experience,
  languages_spoken,
  resume_projects,
  resume_skills,
} from '@/data';
import { trackEvent } from '@/lib/analytics';
import { t, type Lang } from '@/lib/i18n';
import styles from './ResumePage.module.css';

const CATEGORIES = [
  'languages',
  'backend',
  'frontend',
  'ai_automations',
  'data',
  'cloud_devops',
] as const;

const PORTUGUESE_SECTION_LABELS: Record<string, string> = {
  'resume.summary': 'Resumo',
  'resume.experience': 'Experi\u00eancia',
  'resume.education': 'Forma\u00e7\u00e3o acad\u00eamica',
  'resume.skills': 'Habilidades',
  'resume.projects': 'Projetos',
  'resume.certifications': 'Certifica\u00e7\u00f5es',
  'resume.languages_spoken': 'Idiomas',
};

const PORTUGUESE_SKILL_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  languages: 'Linguagens',
  backend: 'Backend',
  frontend: 'Frontend',
  ai_automations: 'IA e automa\u00e7\u00f5es',
  data: 'Dados',
  cloud_devops: 'DevOps, Cloud e ferramentas',
};

function resumeLabel(lang: Lang, key: string): string {
  return lang === 'pt' ? (PORTUGUESE_SECTION_LABELS[key] ?? key) : t(lang, key);
}
function BulletText({ children }: { children: string }) {
  const lines = children
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const bullets = lines.every((line) => line.startsWith('- '));
  if (!bullets) {
    return <p className={styles.bodyCopy}>{children}</p>;
  }
  return (
    <ul className={styles.bulletText}>
      {lines.map((line, i) => (
        <li key={i}>
          {line
            .replace(/^-\s*/, '')
            .split(/(\*\*[^*]+\*\*)/g)
            .map((part, j) =>
              part.startsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part
            )}
        </li>
      ))}
    </ul>
  );
}
function Section({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.resumeSection}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function ResumeSections({ lang }: { lang: Lang }) {
  return (
    <article className={styles.resumeDocument}>
      <header className={styles.documentIdentity}>
        <h2>{contact.name}</h2>
        <div>
          <Anchor
            href={`https://github.com/${contact.github}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('github')}
          >
            github.com/{contact.github}
          </Anchor>
          <Anchor
            href={`https://linkedin.com/in/${contact.linkedin}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('linkedin')}
          >
            linkedin.com/in/{contact.linkedin}
          </Anchor>
        </div>
      </header>
      <Section id="summary" title={resumeLabel(lang, 'resume.summary')}>
        <p className={styles.bodyCopy}>{about.content[lang]}</p>
      </Section>
      <Section id="skills" title={resumeLabel(lang, 'resume.skills')}>
        <div className={styles.skillGrid}>
          {CATEGORIES.map((category) => (
            <div className={styles.skillRow} key={category}>
              <h3>
                {lang === 'pt'
                  ? PORTUGUESE_SKILL_LABELS[category]
                  : t(lang, `resume_labels.${category}`)}
              </h3>
              <p>{resume_skills[category].map((item) => item.name).join(' / ')}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section id="experience" title={resumeLabel(lang, 'resume.experience')}>
        <div className={styles.timeline}>
          {experience.map((entry, i) => (
            <article className={styles.entry} key={`${entry.company}-${i}`}>
              <div className={styles.entryHeading}>
                <div>
                  <h3>
                    {entry.url ? (
                      <Anchor href={entry.url} target="_blank" rel="noreferrer">
                        {entry.title[lang]}
                      </Anchor>
                    ) : (
                      entry.title[lang]
                    )}
                  </h3>
                  <p>
                    {entry.company}
                    {entry.location ? ` · ${entry.location}` : ''}
                  </p>
                </div>
                <time>{entry.period[lang]}</time>
              </div>
              <BulletText>{entry.description[lang]}</BulletText>
            </article>
          ))}
        </div>
      </Section>
      <Section id="projects" title={resumeLabel(lang, 'resume.projects')}>
        <div className={styles.timeline}>
          {resume_projects.map((project, i) => (
            <article className={styles.entry} key={i}>
              <div className={styles.entryHeading}>
                <h3>
                  <Anchor
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('github_repo', { repo: project.name[lang] })}
                  >
                    {project.name[lang]}
                  </Anchor>
                </h3>
              </div>
              <p className={styles.techLine}>{project.technologies.join(' · ')}</p>
              <BulletText>{project.description[lang]}</BulletText>
            </article>
          ))}
        </div>
      </Section>
      <Section id="languages" title={resumeLabel(lang, 'resume.languages_spoken')}>
        <div className={styles.languageGrid}>
          {languages_spoken.map((entry, i) => (
            <p key={i}>
              <strong>{entry.name[lang]}</strong>
              <span>{entry.level[lang]}</span>
            </p>
          ))}
        </div>
      </Section>
      <Section id="certifications" title={resumeLabel(lang, 'resume.certifications')}>
        <div className={styles.timeline}>
          {certifications.map((cert, i) => (
            <article className={styles.entry} key={i}>
              <div className={styles.entryHeading}>
                <h3>
                  {cert.url ? (
                    <Anchor href={cert.url} target="_blank" rel="noreferrer">
                      {cert.name[lang]}
                    </Anchor>
                  ) : (
                    cert.name[lang]
                  )}
                </h3>
                <time>
                  {cert.issuer} · {cert.date}
                </time>
              </div>
              <BulletText>{cert.description[lang]}</BulletText>
            </article>
          ))}
        </div>
      </Section>
      <Section id="education" title={resumeLabel(lang, 'resume.education')}>
        <div className={styles.timeline}>
          {education.map((entry, i) => (
            <article className={styles.entry} key={i}>
              <div className={styles.entryHeading}>
                <div>
                  <h3>{entry.degree[lang]}</h3>
                  <p>{entry.level[lang]}</p>
                </div>
                <time>
                  {entry.start_date} – {entry.end_date}
                </time>
              </div>
              <p className={styles.techLine}>
                {entry.institution} · {entry.location}
              </p>
              <BulletText>{entry.description[lang]}</BulletText>
            </article>
          ))}
        </div>
      </Section>
    </article>
  );
}
