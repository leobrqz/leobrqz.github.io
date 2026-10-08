'use client';

import { Anchor, Box } from '@mantine/core';
import { type ProjectLabel } from '@/data/projects_meta';
import { trackEvent } from '@/lib/analytics';
import { type Lang } from '@/lib/i18n';
import styles from './ProjectLabels.module.css';

export type ProjectLabelsProps = {
  labels: ProjectLabel[];
  lang: Lang;
};

export function ProjectLabels({ labels, lang }: ProjectLabelsProps) {
  if (labels.length === 0) {
    return null;
  }

  const changelogLabel =
    lang === 'en' ? 'Open changelog' : 'Abrir registro de altera\u00e7\u00f5es';

  return (
    <Box component="span" className={styles.labels}>
      {labels.map((label, index) => {
        const className = `${styles.badge} ${label.type === 'new' ? styles.new : styles.update}`;
        const content =
          label.type === 'new'
            ? lang === 'en'
              ? 'New'
              : 'Novo'
            : lang === 'en'
              ? 'Update'
              : 'Atualiza\u00e7\u00e3o';

        if (label.type === 'update' && label.changelogUrl) {
          return (
            <Anchor
              key={`${label.type}-${index}`}
              href={label.changelogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              title={changelogLabel}
              aria-label={changelogLabel}
              onClick={() => trackEvent('project_label_changelog', { url: label.changelogUrl })}
            >
              {content}
            </Anchor>
          );
        }

        return (
          <span key={`${label.type}-${index}`} className={className}>
            {content}
          </span>
        );
      })}
    </Box>
  );
}
