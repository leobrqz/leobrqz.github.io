'use client';

import { useEffect, useState } from 'react';
import { Box, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { contact } from '@/data/contact';
import { t, type Lang } from '@/lib/i18n';

const TYPE_SPEED_MS = 80;
const CURSOR_BLINK_MS = 530;
const DELAY_AFTER_NAME_MS = 400;
const SUBTITLE_SPEED_MS = 36;

export type LandingHeroProps = {
  lang: Lang;
};

function useTypewriter(fullText: string, speedMs: number, startDelayMs: number, run: boolean) {
  const [display, setDisplay] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!run || fullText === '') {
      return;
    }
    const startTimer = setTimeout(() => setStarted(true), startDelayMs);
    return () => clearTimeout(startTimer);
  }, [run, fullText, startDelayMs]);

  useEffect(() => {
    if (!started || display.length >= fullText.length) {
      return;
    }
    const t = setTimeout(() => {
      setDisplay(fullText.slice(0, display.length + 1));
    }, speedMs);
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

export function LandingHero({ lang }: LandingHeroProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const nameDisplay = useTypewriter(contact.name, TYPE_SPEED_MS, 300, true);
  const nameDone = nameDisplay.length >= contact.name.length;
  const subtitle = `${t(lang, 'sidebar.role')} · ${t(lang, 'sidebar.education')}`;
  const subtitleDisplay = useTypewriter(
    subtitle,
    SUBTITLE_SPEED_MS,
    nameDone ? DELAY_AFTER_NAME_MS : 999999,
    nameDone
  );
  const cursorOn = useCursorBlink();

  const gradientStyle = {
    background: isDark
      ? `linear-gradient(110deg, ${theme.colors.blue[3]}, ${theme.colors.cyan[4]})`
      : `linear-gradient(110deg, ${theme.colors.blue[7]}, ${theme.colors.cyan[7]})`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  } as React.CSSProperties;

  return (
    <Box
      component="section"
      style={{
        minHeight: 'min(70vh, 420px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--mantine-spacing-xl) 0',
      }}
    >
      <Box style={{ textAlign: 'center' }}>
        <Box
          component="h1"
          style={{
            margin: 0,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '0.02em',
            lineHeight: 1.3,
            fontFamily: theme.fontFamilyMonospace,
          }}
        >
          <span style={gradientStyle}>{nameDisplay}</span>
          {!nameDone && (
            <span
              style={{
                ...gradientStyle,
                opacity: cursorOn ? 1 : 0.35,
                borderRight: `3px solid ${isDark ? theme.colors.cyan[4] : theme.colors.cyan[7]}`,
                marginLeft: 2,
              }}
            >
              {' '}
            </span>
          )}
        </Box>
        <Text
          size="lg"
          c="dimmed"
          mt="md"
          style={{
            fontFamily: theme.fontFamilyMonospace,
            minHeight: '1.5em',
          }}
        >
          {subtitleDisplay}
          {nameDone && (
            <span
              style={{
                opacity: cursorOn ? 1 : 0.35,
                borderRight: `2px solid var(--mantine-color-dimmed)`,
                marginLeft: 2,
              }}
            >
              {' '}
            </span>
          )}
        </Text>
      </Box>
    </Box>
  );
}
