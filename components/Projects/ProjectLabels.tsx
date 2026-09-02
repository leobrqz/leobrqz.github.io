'use client';

import { Anchor, Box } from '@mantine/core';
import { type ProjectLabel } from '@/data/projects_meta';
import { t, type Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import styles from './ProjectLabels.module.css';

export type ProjectLabelsProps = {
  labels: ProjectLabel[];
  lang: Lang;
};

export function ProjectLabels({ labels, lang }: ProjectLabelsProps) {
  if (labels.length === 0) {
    return null;
  }

  return (
    <Box component="span" className={styles.labels}>
      {labels.map((label, index) => {
        const className = `${styles.badge} ${label.type === 'new' ? styles.new : styles.update}`;
        const content = label.type === 'new'
          ? t(lang, 'projects.label_new')
          : t(lang, 'projects.label_update');

        if (label.type === 'update' && label.changelogUrl) {
          return (
            <Anchor
              key={`${label.type}-${index}`}
              href={label.changelogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              title={t(lang, 'projects.label_changelog_tooltip')}
              aria-label={t(lang, 'projects.label_changelog_tooltip')}
              onClick={() => trackEvent('project_label_changelog', { url: label.changelogUrl })}
            >
              {content}
            </Anchor>
          );
        }

        return <span key={`${label.type}-${index}`} className={className}>{content}</span>;
      })}
    </Box>
  );
}
