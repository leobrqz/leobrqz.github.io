'use client';

import { createTheme } from '@mantine/core';

/** Dark-first app theme. Default color scheme is set in root layout (ColorSchemeScript + MantineProvider). */
export const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'sm',
  fontFamily: 'Aptos, "Segoe UI", sans-serif',
  fontFamilyMonospace: '"Cascadia Mono", "SFMono-Regular", Consolas, monospace',
  headings: {
    fontFamily: 'Bahnschrift, "Arial Narrow", Aptos, sans-serif',
    fontWeight: '700',
  },
});
