'use client';

import { createTheme } from '@mantine/core';

/** Dark-first app theme. Default color scheme is set in root layout (ColorSchemeScript + MantineProvider). */
export const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'sm',
  fontFamily: '"Space Grotesk", Aptos, "Segoe UI", sans-serif',
  fontFamilyMonospace: '"IBM Plex Mono", "Cascadia Mono", "SFMono-Regular", Consolas, monospace',
  headings: {
    fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif',
    fontWeight: '700',
  },
});
