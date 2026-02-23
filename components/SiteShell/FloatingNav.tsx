'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';
import {
  Anchor,
  Avatar,
  Box,
  Burger,
  Divider,
  Drawer,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { contact } from '@/data/contact';
import { t } from '@/lib/i18n';

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
  if (pathname.startsWith('/en')) {
    return pathname;
  }
  return pathname === '/' ? '/en' : `/en${pathname}`;
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

const PILL_GLOW_PADDING = 4;
const PILL_TRANSITION_MS = 220;

function NavPill({
  active,
  theme,
  onCloseDrawer,
  href,
  label,
}: {
  active: boolean;
  theme: ReturnType<typeof useMantineTheme>;
  onCloseDrawer: () => void;
  href: string;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  const glowBg = 'rgba(59, 130, 246, 0.12)';
  const glowShadow = '0 4px 14px rgba(59, 130, 246, 0.25)';

  return (
    <Box
      component="span"
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box
        component="span"
        style={{
          position: 'absolute',
          inset: -PILL_GLOW_PADDING,
          borderRadius: theme.radius.xl,
          background: glowBg,
          boxShadow: glowShadow,
          opacity: hovered && !active ? 1 : 0,
          transform: hovered && !active ? 'scale(1.02)' : 'scale(1)',
          transition: `opacity ${PILL_TRANSITION_MS}ms ease, transform ${PILL_TRANSITION_MS}ms ease, box-shadow ${PILL_TRANSITION_MS}ms ease`,
          pointerEvents: 'none',
        }}
      />
      <Anchor
        component={Link}
        href={href}
        size="sm"
        fw={active ? 600 : 400}
        c={active ? 'white' : undefined}
        underline="never"
        onClick={onCloseDrawer}
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '6px 14px',
          borderRadius: theme.radius.xl,
          backgroundColor: active ? theme.colors.blue[7] : 'transparent',
          transition: `background-color ${PILL_TRANSITION_MS}ms ease`,
        }}
      >
        {label}
      </Anchor>
    </Box>
  );
}

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
          <NavPill
            key={href}
            active={active}
            theme={theme}
            onCloseDrawer={closeDrawer}
            href={navHref(basePath, href)}
            label={t(lang, labelKey)}
          />
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
        <Group
          gap="md"
          wrap="nowrap"
          visibleFrom="sm"
          style={{ flex: 1, justifyContent: 'center' }}
        >
          {navPills}
        </Group>
        <Box style={{ marginLeft: 'auto' }} visibleFrom="sm">
          {langSwitcher}
        </Box>
      </Box>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title={null}
        position="left"
        withCloseButton
        styles={{
          root: { '--drawer-size': '70vw' } as React.CSSProperties,
          content: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            maxHeight: '100vh',
            overflow: 'hidden',
          },
          header: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: theme.spacing.sm,
            minHeight: 'unset',
            flexShrink: 0,
          },
          body: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            padding: 0,
            overflow: 'hidden',
          },
        }}
      >
        <Stack gap={0} style={{ flex: 1, minHeight: 0, height: '100%' }}>
          <Stack align="center" gap="xs" pt="md" pb="md" px="md" style={{ flexShrink: 0 }}>
            <Avatar src="/imgs/profile.jpg" alt="" size={80} radius="xl" />
            <Title order={4} ta="center" fw={600}>
              {contact.name}
            </Title>
            <Text size="sm" c="dimmed" ta="center" fw={500}>
              {t(lang, 'sidebar.role')}
            </Text>
            <Text size="xs" c="dimmed" ta="center">
              {t(lang, 'sidebar.education')}
            </Text>
            <Group gap="sm" justify="center" mt="sm">
              <UnstyledButton
                component="a"
                href={`https://github.com/${contact.github}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--mantine-color-dimmed)',
                }}
              >
                <IconBrandGithub size={24} />
              </UnstyledButton>
              <UnstyledButton
                component="a"
                href={`https://linkedin.com/in/${contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--mantine-color-dimmed)',
                }}
              >
                <IconBrandLinkedin size={24} />
              </UnstyledButton>
            </Group>
            <Divider my="md" w="100%" />
          </Stack>

          <Stack gap="xs" px="md" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            {NAV_ITEMS.map(({ href, labelKey }) => {
              const active = isNavActive(href);
              return (
                <Anchor
                  key={href}
                  component={Link}
                  href={navHref(basePath, href)}
                  underline="never"
                  onClick={closeDrawer}
                >
                  <Paper
                    p="md"
                    radius="md"
                    withBorder
                    style={{
                      backgroundColor: active ? theme.colors.blue[9] : theme.colors.dark[6],
                      borderLeft: `4px solid ${active ? theme.colors.blue[5] : 'transparent'}`,
                      transition: 'background-color 0.15s ease, border-color 0.15s ease',
                    }}
                  >
                    <Text size="md" fw={active ? 600 : 500} c={active ? 'white' : 'gray.3'}>
                      {t(lang, labelKey)}
                    </Text>
                  </Paper>
                </Anchor>
              );
            })}
          </Stack>

          <Box
            py="lg"
            px="md"
            style={{
              borderTop: `1px solid ${theme.colors.dark[4]}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <Group gap="md" wrap="nowrap">
              {LANG_OPTIONS.map(({ lang: l, flag, label }) => {
                const isActive = l === 'en' ? isEn : !isEn;
                return (
                  <UnstyledButton
                    key={l}
                    component={Link}
                    href={getLangHref(pathname, l)}
                    onClick={closeDrawer}
                    title={label}
                    style={{
                      width: 44,
                      height: 44,
                      padding: 0,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isActive ? `2px solid ${theme.colors.blue[5]}` : '2px solid transparent',
                      boxShadow: isActive ? `0 0 0 1px ${theme.colors.blue[7]}` : undefined,
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
                );
              })}
            </Group>
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}
