'use client';

import React from 'react';
import { Text, TextProps } from '@mantine/core';

interface TerminalTextProps extends TextProps {
  prompt?: boolean;
  children: React.ReactNode;
}

export function TerminalText({
  prompt = false,
  children,
  style,
  ...props
}: TerminalTextProps) {
  return (
    <Text
      style={{
        fontFamily: 'inherit',
        whiteSpace: 'pre-line',
        ...style,
      }}
      {...props}
    >
      {prompt && (
        <Text span c="dimmed" mr="xs" style={{ fontFamily: 'inherit' }}>
          {'>'}
        </Text>
      )}
      {children}
    </Text>
  );
}
