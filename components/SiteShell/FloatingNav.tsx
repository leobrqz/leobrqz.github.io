'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconBrandGithub, IconBrandLinkedin, IconMoon, IconSun } from '@tabler/icons-react';
import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Burger,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { contact } from '@/data/contact';
import { t } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import { useThemeContext } from '@/components/ThemeProvider';

const NAV_ITEMS = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/projects', labelKey: 'nav.projects' },
  { href: '/resume', labelKey: 'nav.resume' },
  { href: '/contact', labelKey: 'nav.contact' },
];

const LANG_OPTIONS: { lang: 'pt' | 'en'; flag: string; label: string }[] = [
  { lang: 'pt', flag: '/flags/br.svg', label: 'PT' },
  { lang: 'en', flag: '/flags/us.svg', label: 'EN' },
];

function getLangHref(pathname: string, targetLang: 'pt' | 'en'): string {
  if (targetLang === 'pt') {
    if (pathname.startsWith('/en')) return pathname.slice(3) || '/';
    return pathname;
  }
  if (pathname.startsWith('/en')) return pathname;
  return pathname === '/' ? '/en' : `/en${pathname}`;
}

function navHref(basePath: string, path: string) {
  if (path === '/') return basePath === '' ? '/' : basePath;
  return basePath + path;
}

function normalizePath(p: string) {
  return (p || '/').replace(/\/$/, '') || '/';
}

export type FloatingNavProps = { lang: 'pt' | 'en' };

export function FloatingNav({ lang }: FloatingNavProps) {
  const [drawerOpened, { open, close }] = useDisclosure(false);
  const pathname = usePathname();
  const basePath = lang === 'en' ? '/en' : '';
  const isEn = lang === 'en';
  const { theme, toggleTheme } = useThemeContext();
  const isNerv = theme === 'nerv';
  const borderColor = 'var(--mantine-color-dark-6)';

  const isActive = (href: string) => {
    const current = normalizePath(pathname);
    const target = normalizePath(basePath + href);
    return current === target;
  };

  return (
    <>
      <Box
        component="nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 44,
          borderBottom: `1px solid ${borderColor}`,
          backgroundColor: isNerv ? '#201430' : '#F5F0E6',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Group justify="space-between" style={{ width: '100%' }} px="sm">
          <Group gap={0} wrap="nowrap" visibleFrom="sm">
            {NAV_ITEMS.map(({ href, labelKey }, i) => {
              const active = isActive(href);
              return (
                <Box key={href} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && (
                    <Text span size="xs" c="dimmed" mx={4}>
                      /
                    </Text>
                  )}
                  <Anchor
                    component={Link}
                    href={navHref(basePath, href)}
                    size="xs"
                    fw={active ? 700 : 400}
                    c={active ? (isNerv ? 'evaGreen.4' : 'lclRust.5') : 'dimmed'}
                    underline="never"
                    style={{
                      letterSpacing: '0.04em',
                      borderBottom: active ? '2px solid' : '2px solid transparent',
                      borderColor: active
                        ? isNerv
                          ? '#87FF5F'
                          : '#D4790A'
                        : 'transparent',
                      paddingBottom: 2,
                    }}
                  >
                    {t(lang, labelKey)}
                  </Anchor>
                </Box>
              );
            })}
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={open}
            hiddenFrom="sm"
            size="sm"
            color="var(--mantine-color-dimmed)"
          />

          <Group gap={8}>
            <Group gap={2} wrap="nowrap">
              {LANG_OPTIONS.map(({ lang: l, flag, label }) => {
                const active = l === 'en' ? isEn : !isEn;
                return (
                  <UnstyledButton
                    key={l}
                    component={Link}
                    href={getLangHref(pathname, l)}
                    onClick={close}
                    title={label}
                    style={{
                      opacity: active ? 1 : 0.4,
                      padding: 2,
                      lineHeight: 0,
                    }}
                  >
                    <img
                      src={flag}
                      alt={label}
                      width={20}
                      height={14}
                      style={{ display: 'block' }}
                    />
                  </UnstyledButton>
                );
              })}
            </Group>
            <Box style={{ width: 1, height: 16, backgroundColor: borderColor }} />
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={toggleTheme}
              color="dimmed"
            >
              {isNerv ? <IconMoon size={16} /> : <IconSun size={16} />}
            </ActionIcon>
          </Group>
        </Group>
      </Box>

      <Drawer
        opened={drawerOpened}
        onClose={close}
        size="xs"
        padding="md"
        hiddenFrom="sm"
      >
        <Stack gap="md">
          <Group>
            <Avatar src="/imgs/profile.jpg" size="md" radius={0} />
            <Box>
              <Text size="sm" fw={600} style={{ letterSpacing: '0.03em' }}>
                {contact.name}
              </Text>
              <Text size="xs" c="dimmed">
                {t(lang, 'sidebar.role')}
              </Text>
            </Box>
          </Group>
          <Divider />
          {NAV_ITEMS.map(({ href, labelKey }) => {
            const active = isActive(href);
            return (
              <Anchor
                key={href}
                component={Link}
                href={navHref(basePath, href)}
                size="sm"
                fw={active ? 700 : 400}
                c={active ? (isNerv ? 'evaGreen.4' : 'lclRust.5') : 'dimmed'}
                underline="never"
                onClick={close}
                style={{
                  letterSpacing: '0.03em',
                  paddingLeft: active ? 8 : 0,
                  borderLeft: active ? '2px solid' : '2px solid transparent',
                  borderColor: active
                    ? isNerv
                      ? '#87FF5F'
                      : '#D4790A'
                    : 'transparent',
                }}
              >
                {t(lang, labelKey)}
              </Anchor>
            );
          })}
          <Divider />
          <Group gap="xs">
            <Anchor
              href={`https://github.com/${contact.github}`}
              target="_blank"
              rel="noopener noreferrer"
              c="dimmed"
              onClick={() => { trackEvent('github'); close(); }}
            >
              <IconBrandGithub size={18} />
            </Anchor>
            <Anchor
              href={`https://linkedin.com/in/${contact.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              c="dimmed"
              onClick={() => { trackEvent('linkedin'); close(); }}
            >
              <IconBrandLinkedin size={18} />
            </Anchor>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
