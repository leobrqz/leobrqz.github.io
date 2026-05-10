'use client';

import React from 'react';
import { Box } from '@mantine/core';
import { FloatingNav, type FloatingNavProps } from './FloatingNav';
import { ThreeBackground } from '@/components/ThreeBackground/ThreeBackground';
import { Scanlines } from '@/components/Scanlines';

export function SiteShell({ lang, children }: FloatingNavProps & { children: React.ReactNode }) {
  return (
    <>
      <ThreeBackground />
      <Scanlines />
      <FloatingNav lang={lang} />
      <Box
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          paddingTop: 52,
        }}
      >
        {children}
      </Box>
    </>
  );
}
