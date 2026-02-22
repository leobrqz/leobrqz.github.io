'use client';

import { createTheme } from '@mantine/core';

/** Dark-first app theme. Default color scheme is set in root layout (ColorSchemeScript + MantineProvider). */
export const theme = createTheme({
  primaryColor: 'blue',
});
