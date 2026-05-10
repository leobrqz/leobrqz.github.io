'use client';

import React from 'react';
import { Paper, PaperProps } from '@mantine/core';

interface BruteCardProps extends PaperProps {
  children: React.ReactNode;
}

export function BruteCard({ children, style, ...props }: BruteCardProps) {
  return (
    <Paper
      withBorder
      p="lg"
      radius={0}
      style={{
        borderWidth: 1,
        boxShadow: 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}
