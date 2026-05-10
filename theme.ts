'use client';

import { createTheme } from '@mantine/core';

const evaGreen = [
  '#EDFFE5',
  '#D4FFBF',
  '#B5FF99',
  '#87FF5F',
  '#6DE545',
  '#55CC30',
  '#40A020',
  '#308015',
  '#206010',
  '#104008',
] as const;

const reiPurple = [
  '#F4F0FF',
  '#E1D6F8',
  '#C9B8F0',
  '#AB92FC',
  '#B968FC',
  '#875FAF',
  '#67478A',
  '#483160',
  '#39274D',
  '#201430',
] as const;

const nervOrange = [
  '#FFF3E6',
  '#FFE0BF',
  '#FFCC99',
  '#F5B873',
  '#E6BB85',
  '#D99145',
  '#C47A30',
  '#A06028',
  '#804820',
  '#603010',
] as const;

export const nervTheme = createTheme({
  primaryColor: 'evaGreen',
  colors: {
    evaGreen,
    reiPurple,
    nervOrange,
    dark: reiPurple,
  },
  fontFamilyMonospace:
    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
  fontFamily:
    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
  defaultRadius: 0,
  headings: {
    fontFamily:
      "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
  },
});

const lclCream = [
  '#FFFBF5',
  '#F5F0E6',
  '#EBE3D5',
  '#DFD0B8',
  '#CCBBAA',
  '#BAA690',
  '#A89278',
  '#8C7358',
  '#6B5D4E',
  '#1A1A1A',
] as const;

const lclRust = [
  '#FFF0EB',
  '#FFDDD0',
  '#FFC4AD',
  '#E8A080',
  '#D4790A',
  '#B86808',
  '#8B2500',
  '#6B1C00',
  '#4D1400',
  '#2E0C00',
] as const;

export const lclTheme = createTheme({
  primaryColor: 'lclRust',
  colors: {
    lclRust,
    lclCream,
    dark: lclCream,
  },
  fontFamilyMonospace:
    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
  fontFamily:
    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
  defaultRadius: 0,
  headings: {
    fontFamily:
      "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
  },
});
