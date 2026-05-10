'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Box, Group } from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';
import { contact } from '@/data/contact';
import { t, type Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import { useThemeContext } from '@/components/ThemeProvider';

const TYPE_SPEED_MS = 70;
const CURSOR_BLINK_MS = 530;
const DELAY_BETWEEN_LINES_MS = 400;

function useTypewriter(fullText: string, speedMs: number, startDelayMs: number, run: boolean) {
  const [display, setDisplay] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!run || fullText === '') return;
    const t = setTimeout(() => setStarted(true), startDelayMs);
    return () => clearTimeout(t);
  }, [run, fullText, startDelayMs]);

  useEffect(() => {
    if (!started || display.length >= fullText.length) return;
    const t = setTimeout(() => setDisplay(fullText.slice(0, display.length + 1)), speedMs);
    return () => clearTimeout(t);
  }, [started, display, fullText, speedMs]);

  return display;
}

function useCursorBlink() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), CURSOR_BLINK_MS);
    return () => clearInterval(id);
  }, []);
  return on;
}

export type LandingHeroProps = { lang: Lang };

export function LandingHero({ lang }: LandingHeroProps) {
  const { theme } = useThemeContext();
  const isNerv = theme === 'nerv';
  const primaryColor = isNerv ? '#87FF5F' : '#D4790A';

  const nameParts = contact.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const firstDisplay = useTypewriter(firstName, TYPE_SPEED_MS, 300, true);
  const firstDone = firstDisplay.length >= firstName.length;
  const lastDisplay = useTypewriter(
    lastName,
    TYPE_SPEED_MS,
    firstDone ? DELAY_BETWEEN_LINES_MS : 999999,
    firstDone,
  );
  const lastDone = lastDisplay.length >= lastName.length;
  const cursorOn = useCursorBlink();

  const lineStyle = {
    display: 'block',
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    fontWeight: 800 as const,
    letterSpacing: '0.05em',
    lineHeight: 1.15,
    color: primaryColor,
    minHeight: '1.15em',
  };

  return (
    <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box style={{ maxWidth: 500 }}>
        <Box
          component="h1"
          style={{
            margin: 0,
          }}
        >
          <span style={lineStyle}>
            {firstDisplay}
            {!firstDone && (
              <span
                style={{
                  opacity: cursorOn ? 1 : 0.35,
                  borderRight: `3px solid ${primaryColor}`,
                  marginLeft: 2,
                }}
              >
                {' '}
              </span>
            )}
          </span>
          <span style={{ ...lineStyle, color: 'var(--mantine-color-dimmed)' }}>
            {lastDisplay}
            {firstDone && !lastDone && (
              <span
                style={{
                  opacity: cursorOn ? 1 : 0.35,
                  borderRight: '3px solid var(--mantine-color-dimmed)',
                  marginLeft: 2,
                }}
              >
                {' '}
              </span>
            )}
          </span>
        </Box>

        <Box mt="md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: lastDone ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Box style={{ display: 'block', fontSize: 'var(--mantine-font-size-sm)', letterSpacing: '0.04em', color: 'var(--mantine-color-dimmed)' }}>
              {t(lang, 'sidebar.role')}
            </Box>
            <Box style={{ display: 'block', fontSize: 'var(--mantine-font-size-sm)', letterSpacing: '0.04em', color: 'var(--mantine-color-dimmed)' }}>
              {t(lang, 'sidebar.education')}
            </Box>
          </motion.div>
        </Box>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: lastDone ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Group gap="xs" mt="lg">
            <Anchor
              href={`https://github.com/${contact.github}`}
              target="_blank"
              rel="noopener noreferrer"
              c="dimmed"
              aria-label="GitHub"
              onClick={() => trackEvent('github')}
            >
              <IconBrandGithub size={24} stroke={1.5} />
            </Anchor>
            <Anchor
              href={`https://linkedin.com/in/${contact.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              c="dimmed"
              aria-label="LinkedIn"
              onClick={() => trackEvent('linkedin')}
            >
              <IconBrandLinkedin size={24} stroke={1.5} />
            </Anchor>
          </Group>
        </motion.div>
      </Box>
    </Box>
  );
}
