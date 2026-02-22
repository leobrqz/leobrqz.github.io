'use client';

import {
  Box,
  Group,
  Anchor,
  Burger,
  Drawer,
  Stack,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t } from '../../lib/i18n';

const NAV_ITEMS: { href: string; labelKey: string }[] = [
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
    if (pathname.startsWith('/en')) {
      const rest = pathname.slice(3) || '/';
      return rest;
    }
    return pathname;
  }
  if (pathname.startsWith('/en')) return pathname;
  return pathname === '/' ? '/en' : '/en' + pathname;
}

function navHref(basePath: string, path: string) {
  if (path === '/') {
    return basePath === '' ? '/' : basePath;
  }
  return basePath + path;
}

function normalizePath(p: string) {
  return (p || '/').replace(/\/$/, '') || '/';
}

const FLAG_SIZE = 28;

export type FloatingNavProps = {
  lang: 'pt' | 'en';
};

export function FloatingNav({ lang }: FloatingNavProps) {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const theme = useMantineTheme();
  const pathname = usePathname();
  const basePath = lang === 'en' ? '/en' : '';
  const isEn = lang === 'en';

  const isNavActive = (href: string) => {
    const current = normalizePath(pathname);
    const target = normalizePath(basePath + href);
    return current === target;
  };

  const navPills = (
    <Group gap="xs" wrap="nowrap">
      {NAV_ITEMS.map(({ href, labelKey }) => {
        const active = isNavActive(href);
        return (
          <Anchor
            key={href}
            component={Link}
            href={navHref(basePath, href)}
            size="sm"
            fw={active ? 600 : 400}
            c={active ? 'white' : undefined}
            underline="never"
            onClick={closeDrawer}
            style={{
              padding: '6px 14px',
              borderRadius: theme.radius.xl,
              backgroundColor: active ? theme.colors.blue[7] : 'transparent',
            }}
          >
            {t(lang, labelKey)}
          </Anchor>
        );
      })}
    </Group>
  );

  const langSwitcher = (
    <Group gap={6} wrap="nowrap">
      {LANG_OPTIONS.map(({ lang: l, flag, label }) => {
        const active = l === 'en' ? isEn : !isEn;
        return (
          <UnstyledButton
            key={l}
            component={Link}
            href={getLangHref(pathname, l)}
            onClick={closeDrawer}
            title={label}
            style={{
              width: FLAG_SIZE + 8,
              height: FLAG_SIZE + 8,
              padding: 0,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: active ? `2px solid ${theme.colors.blue[5]}` : '2px solid transparent',
              boxShadow: active ? `0 0 0 1px ${theme.colors.blue[7]}` : undefined,
            }}
          >
            <img
              src={flag}
              alt=""
              width={FLAG_SIZE}
              height={FLAG_SIZE}
              style={{ borderRadius: '50%', objectFit: 'cover', display: 'block' }}
            />
          </UnstyledButton>
        );
      })}
    </Group>
  );

  return (
    <>
      <Box
        component="nav"
        style={{
          position: 'sticky',
          top: 20,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          paddingLeft: theme.spacing.md,
          paddingRight: theme.spacing.md,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Burger
          opened={drawerOpened}
          onClick={openDrawer}
          hiddenFrom="sm"
          size="sm"
          aria-label="Open navigation"
        />
        <Group gap="md" wrap="nowrap" visibleFrom="sm" style={{ flex: 1, justifyContent: 'center' }}>
          {navPills}
        </Group>
        <Box style={{ marginLeft: 'auto' }}>{langSwitcher}</Box>
      </Box>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title={null}
        size="sm"
        position="left"
        styles={{
          header: { display: 'none' },
        }}
      >
        <Stack gap="xs" pt="md">
          {NAV_ITEMS.map(({ href, labelKey }) => {
            const active = isNavActive(href);
            return (
              <Anchor
                key={href}
                component={Link}
                href={navHref(basePath, href)}
                size="md"
                fw={active ? 600 : 400}
                c={active ? 'blue' : undefined}
                underline="never"
                onClick={closeDrawer}
              >
                {t(lang, labelKey)}
              </Anchor>
            );
          })}
          <Group gap="sm" pt="md" style={{ borderTop: `1px solid ${theme.colors.dark[4]}` }}>
            {LANG_OPTIONS.map(({ lang: l, flag, label }) => (
              <UnstyledButton
                key={l}
                component={Link}
                href={getLangHref(pathname, l)}
                onClick={closeDrawer}
                title={label}
                style={{
                  width: 40,
                  height: 40,
                  padding: 0,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={flag}
                  alt=""
                  width={32}
                  height={32}
                  style={{ borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                />
              </UnstyledButton>
            ))}
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
