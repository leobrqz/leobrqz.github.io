'use client';

import { useState } from 'react';
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
      return pathname.slice(3) || '/';
    }
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
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const pathname = usePathname();
  const basePath = lang === 'en' ? '/en' : '';
  const isEn = lang === 'en';
  const { theme, toggleTheme } = useThemeContext();
  const isNerv = theme === 'nerv';

  const isNavActive = (href: string) => {
    const current = normalizePath(pathname);
    const target = normalizePath(basePath + href);
    return current === target;
  };

  const navPills = (
    <Group gap={0} wrap="nowrap">
      {NAV_ITEMS.map(({ href, labelKey }) => {
        const active = isNavActive(href);
        return (
          <Anchor
            key={href}
            component={Link}
            href={navHref(basePath, href)}
            size="sm"
            fw={active ? 700 : 400}
            c={active ? (isNerv ? 'evaGreen.4' : 'lclRust.5') : 'dimmed'}
            underline="never"
            onClick={closeDrawer}
            px="md"
            py={6}
            style={{
              border: active ? '1px solid' : '1px solid transparent',
              borderColor: active ? 'var(--mantine-primary-color-4)' : 'transparent',
            }}
          >
            {t(lang, labelKey)}
          </Anchor>
        );
      })}
    </Group>
  );

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
          borderBottom: '1px solid var(--mantine-color-dark-6)',
          backgroundColor: isNerv ? '#201430' : '#F5F0E6',
        }}
      >
        <Group justify="space-between" px="md" h={52}>
          <Group gap="xs" visibleFrom="sm">
            {navPills}
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={openDrawer}
            hiddenFrom="sm"
            size="sm"
            color="var(--mantine-color-dimmed)"
          />

          <Group gap="sm">
            <Group gap={4} wrap="nowrap">
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
                      border: active ? '1px solid var(--mantine-primary-color-4)' : '1px solid transparent',
                      padding: 2,
                      lineHeight: 0,
                    }}
                  >
                    <img src={flag} alt={label} width={22} height={16} style={{ display: 'block' }} />
                  </UnstyledButton>
                );
              })}
            </Group>

            <ActionIcon
              variant="subtle"
              size="md"
              onClick={toggleTheme}
              title="Toggle theme"
              color="dimmed"
            >
              {isNerv ? <IconMoon size={18} /> : <IconSun size={18} />}
            </ActionIcon>
          </Group>
        </Group>
      </Box>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="xs"
        padding="md"
        hiddenFrom="sm"
        style={{ borderRight: '1px solid var(--mantine-color-dark-6)' }}
      >
        <Stack gap="lg">
          <Group>
            <Avatar src="/imgs/profile.jpg" size="lg" radius={0} />
            <Box>
              <Title order={6}>{contact.name}</Title>
              <Text size="xs" c="dimmed">
                {t(lang, 'sidebar.role')}
              </Text>
              <Group gap="xs" mt={4}>
                <Anchor
                  href={`https://github.com/${contact.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  c="dimmed"
                  size="xs"
                  onClick={() => { trackEvent('github'); closeDrawer(); }}
                >
                  <Group gap={4} wrap="nowrap">
                    <IconBrandGithub size={14} />
                  </Group>
                </Anchor>
                <Anchor
                  href={`https://linkedin.com/in/${contact.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  c="dimmed"
                  size="xs"
                  onClick={() => { trackEvent('linkedin'); closeDrawer(); }}
                >
                  <Group gap={4} wrap="nowrap">
                    <IconBrandLinkedin size={14} />
                  </Group>
                </Anchor>
              </Group>
            </Box>
          </Group>
          <Divider />
          {NAV_ITEMS.map(({ href, labelKey }) => {
            const active = isNavActive(href);
            return (
              <Anchor
                key={href}
                component={Link}
                href={navHref(basePath, href)}
                size="sm"
                fw={active ? 700 : 400}
                c={active ? (isNerv ? 'evaGreen.4' : 'lclRust.5') : 'dimmed'}
                underline="never"
                onClick={closeDrawer}
                py={4}
                style={{
                  borderBottom: active ? '1px solid var(--mantine-primary-color-4)' : '1px solid transparent',
                }}
              >
                {t(lang, labelKey)}
              </Anchor>
            );
          })}
          <Divider />
          <Group gap={4}>
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
                    border: active ? '1px solid var(--mantine-primary-color-4)' : '1px solid transparent',
                    padding: 2,
                  }}
                >
                  <img src={flag} alt={label} width={26} height={18} style={{ display: 'block' }} />
                </UnstyledButton>
              );
            })}
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
