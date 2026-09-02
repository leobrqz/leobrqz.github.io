'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconArrowUpRight, IconBrandGithub, IconBrandLinkedin, IconX } from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Burger,
  Drawer,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { contact } from '@/data/contact';
import { t } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import styles from './FloatingNav.module.css';

const NAV_ITEMS: { href: string; labelKey: string }[] = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/projects', labelKey: 'nav.projects' },
  { href: '/resume', labelKey: 'nav.resume' },
  { href: '/contact', labelKey: 'nav.contact' },
];

const LANG_OPTIONS: { lang: 'pt' | 'en'; label: string }[] = [
  { lang: 'pt', label: 'PT' },
  { lang: 'en', label: 'EN' },
];

function getLangHref(pathname: string, targetLang: 'pt' | 'en'): string {
  if (targetLang === 'pt') {
    if (pathname.startsWith('/en')) {
      return pathname.slice(3) || '/';
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

function normalizePath(path: string) {
  return (path || '/').replace(/\/$/, '') || '/';
}

export type FloatingNavProps = {
  lang: 'pt' | 'en';
};

export function FloatingNav({ lang }: FloatingNavProps) {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const pathname = usePathname() || '/';
  const basePath = lang === 'en' ? '/en' : '';

  const isNavActive = (href: string) => {
    return normalizePath(pathname) === normalizePath(basePath + href);
  };

  const languageSwitcher = (
    <div className={styles.languageSwitcher} aria-label="Language">
      {LANG_OPTIONS.map(({ lang: optionLang, label }) => {
        const active = optionLang === lang;
        return (
          <UnstyledButton
            key={optionLang}
            component={Link}
            href={getLangHref(pathname, optionLang)}
            className={`${styles.languageButton} ${active ? styles.languageActive : ''}`}
            aria-current={active ? 'page' : undefined}
            title={label}
            onClick={closeDrawer}
          >
            {label}
          </UnstyledButton>
        );
      })}
    </div>
  );

  const navigation = (
    <div className={styles.links}>
      {NAV_ITEMS.map(({ href, labelKey }) => {
        const active = isNavActive(href);
        return (
          <Anchor
            key={href}
            component={Link}
            href={navHref(basePath, href)}
            className={`${styles.link} ${active ? styles.linkActive : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={closeDrawer}
          >
            {t(lang, labelKey)}
          </Anchor>
        );
      })}
    </div>
  );

  return (
    <>
      <Box component="header" className={styles.header}>
        <div className={styles.headerInner}>
          <Anchor component={Link} href={basePath || '/'} className={styles.brand} underline="never">
            <span className={styles.brandMark}>LB</span>
            <span className={styles.brandName}>Leonardo Briquezi</span>
          </Anchor>

          <Box visibleFrom="sm">{navigation}</Box>

          <div className={styles.headerMeta}>
            <Box visibleFrom="sm">{languageSwitcher}</Box>
          </div>

          <Box hiddenFrom="sm" className={styles.mobileMenuButton}>
            <Burger
              opened={drawerOpened}
              onClick={openDrawer}
              size="sm"
              color="var(--site-ink)"
              aria-label={t(lang, 'nav.open_menu')}
            />
          </Box>
        </div>
      </Box>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        size="min(88vw, 360px)"
        withCloseButton={false}
        classNames={{ content: styles.drawerContent, body: styles.drawerBody }}
        overlayProps={{ backgroundOpacity: 0.42, blur: 2 }}
      >
        <div className={styles.drawerTop}>
          <div>
            <span className={styles.drawerEyebrow}>LB / MENU</span>
            <Text className={styles.drawerTitle}>{contact.name}</Text>
          </div>
          <UnstyledButton className={styles.drawerClose} onClick={closeDrawer} aria-label="Close menu">
            <IconX size={20} />
          </UnstyledButton>
        </div>

        <nav className={styles.drawerNav} aria-label="Mobile navigation">
          <Stack gap={0}>
            {NAV_ITEMS.map(({ href, labelKey }) => {
              const active = isNavActive(href);
              return (
                <Anchor
                  key={href}
                  component={Link}
                  href={navHref(basePath, href)}
                  className={`${styles.drawerLink} ${active ? styles.drawerLinkActive : ''}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={closeDrawer}
                >
                  {t(lang, labelKey)}
                  <IconArrowUpRight size={17} />
                </Anchor>
              );
            })}
          </Stack>
        </nav>

        <div className={styles.drawerBottom}>
          <div className={styles.drawerSocials}>
            <Anchor href={`https://github.com/${contact.github}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('github')}>
              <IconBrandGithub size={18} /> GitHub
            </Anchor>
            <Anchor href={`https://linkedin.com/in/${contact.linkedin}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('linkedin')}>
              <IconBrandLinkedin size={18} /> LinkedIn
            </Anchor>
          </div>
          {languageSwitcher}
        </div>
      </Drawer>
    </>
  );
}
