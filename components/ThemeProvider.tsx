'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { lclTheme, nervTheme } from '@/theme';

export type ThemeName = 'nerv' | 'lcl';

interface ThemeContextValue {
  theme: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'nerv',
  toggleTheme: () => {},
});

export function useThemeContext() {
  return useContext(ThemeContext);
}

function getStoredTheme(): ThemeName {
  if (typeof window === 'undefined') return 'nerv';
  const stored = localStorage.getItem('brqz-theme');
  if (stored === 'lcl') return 'lcl';
  return 'nerv';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('nerv');

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'nerv' ? 'lcl' : 'nerv';
      localStorage.setItem('brqz-theme', next);
      return next;
    });
  }, []);

  const mantineTheme = theme === 'nerv' ? nervTheme : lclTheme;
  const colorScheme = theme === 'nerv' ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MantineProvider
        theme={mantineTheme}
        forceColorScheme={colorScheme}
      >
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
}
