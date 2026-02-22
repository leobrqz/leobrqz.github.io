'use client';

import { Box, useMantineColorScheme, useMantineTheme } from '@mantine/core';

export type IdeBackgroundProps = {
  children: React.ReactNode;
};

export function IdeBackground({ children }: IdeBackgroundProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const bgColor = isDark ? theme.colors.dark[8] : theme.colors.gray[0];

  return (
    <Box
      component="section"
      style={{
        minHeight: '100vh',
        background: bgColor,
        backgroundAttachment: 'fixed',
      }}
    >
      {children}
    </Box>
  );
}
