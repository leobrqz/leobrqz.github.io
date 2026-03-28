'use client';

import { motion } from 'framer-motion';
import { Anchor, Box, useMantineTheme } from '@mantine/core';
import { type ProjectLabel } from '@/data/projects_meta';
import { t, type Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';

const PULSE_DURATION_S = 2.4;
const BADGE_PADDING_X = 8;
const BADGE_PADDING_Y = 2;
const BADGE_RADIUS_PILL = 9999;
const BADGE_FONT_SIZE = 10;
const BADGE_FONT_WEIGHT = 600;
const BADGE_LETTER_SPACING = '0.02em';
const BADGE_TEXT_SHADOW = '0 0 1px rgba(0,0,0,0.25)';

export type ProjectLabelsProps = {
  labels: ProjectLabel[];
  lang: Lang;
};

function LabelBadge({
  children,
  bgColor,
  borderColor,
  textColor,
}: {
  children: React.ReactNode;
  bgColor: string;
  borderColor: string;
  textColor: string;
}) {
  return (
    <motion.span
      style={{ display: 'inline-flex' }}
      animate={{ opacity: [0.92, 1, 0.92] }}
      transition={{
        repeat: Infinity,
        duration: PULSE_DURATION_S,
        ease: 'easeInOut',
      }}
    >
      <Box
        component="span"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${BADGE_PADDING_Y}px ${BADGE_PADDING_X}px`,
          borderRadius: BADGE_RADIUS_PILL,
          fontSize: BADGE_FONT_SIZE,
          fontWeight: BADGE_FONT_WEIGHT,
          letterSpacing: BADGE_LETTER_SPACING,
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          boxShadow: '0 0 0 1px rgba(0,0,0,0.03)',
          textShadow: BADGE_TEXT_SHADOW,
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {children}
      </Box>
    </motion.span>
  );
}

export function ProjectLabels({ labels, lang }: ProjectLabelsProps) {
  const theme = useMantineTheme();

  if (labels.length === 0) {
    return null;
  }

  const newBg = 'rgba(48, 164, 108, 0.18)';
  const newBorder = 'rgba(48, 164, 108, 0.45)';
  const newText = theme.colors.green[2];
  const updateBg = 'rgba(59, 130, 246, 0.16)';
  const updateBorder = 'rgba(59, 130, 246, 0.4)';
  const updateText = theme.colors.blue[1];

  return (
    <Box
      component="span"
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: 6,
        verticalAlign: 'middle',
      }}
    >
      {labels.map((label, index) => {
        if (label.type === 'new') {
          return (
            <LabelBadge
              key={`new-${index}`}
              bgColor={newBg}
              borderColor={newBorder}
              textColor={newText}
            >
              {t(lang, 'projects.label_new')}
            </LabelBadge>
          );
        }
        if (label.type === 'update') {
          const badge = (
            <LabelBadge
              bgColor={updateBg}
              borderColor={updateBorder}
              textColor={updateText}
            >
              {t(lang, 'projects.label_update')}
            </LabelBadge>
          );
          if (label.changelogUrl) {
            return (
              <Anchor
                key={`update-${index}`}
                href={label.changelogUrl}
                target="_blank"
                rel="noopener noreferrer"
                underline="never"
                title={t(lang, 'projects.label_changelog_tooltip')}
                aria-label={t(lang, 'projects.label_changelog_tooltip')}
                onClick={() =>
                  trackEvent('project_label_changelog', { url: label.changelogUrl })
                }
                style={{ display: 'inline-flex' }}
              >
                {badge}
              </Anchor>
            );
          }
          return (
            <Box key={`update-${index}`} component="span" style={{ display: 'inline-flex' }}>
              {badge}
            </Box>
          );
        }
        return null;
      })}
    </Box>
  );
}
