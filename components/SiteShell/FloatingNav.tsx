'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IconArrowRight, IconMenu2, IconX } from '@tabler/icons-react';
import { contact } from '@/data/contact';
import styles from './FloatingNav.module.css';

const NAV_ITEMS = [
  { id: 'home', path: '', label: { pt: 'Início', en: 'Home' } },
  { id: 'projects', path: '/projects', label: { pt: 'Projetos', en: 'Projects' } },
  { id: 'resume', path: '/resume', label: { pt: 'Currículo', en: 'Resume' } },
  { id: 'contact', path: '/contact', label: { pt: 'Contato', en: 'Contact' } },
] as const;

const LANG_OPTIONS: { lang: 'pt' | 'en'; label: string }[] = [
  { lang: 'pt', label: 'PT' },
  { lang: 'en', label: 'EN' },
];

function getLangHref(pathname: string, targetLang: 'pt' | 'en'): string {
  const withoutLang = pathname.startsWith('/en') ? pathname.slice(3) || '/' : pathname;
  return targetLang === 'en' ? (withoutLang === '/' ? '/en' : `/en${withoutLang}`) : withoutLang;
}

export type FloatingNavProps = {
  lang: 'pt' | 'en';
};

export function FloatingNav({ lang }: FloatingNavProps) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const localePrefix = lang === 'en' ? '/en' : '';
  const homePath = localePrefix || '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  const switchLanguage = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    router.push(`${href}${window.location.search}${window.location.hash}`);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const navItems = (
    <>
      {NAV_ITEMS.map((item) => {
        const href = `${localePrefix}${item.path}` || '/';
        const active = pathname.replace(/\/$/, '') === href.replace(/\/$/, '');
        return (
          <Link
            key={item.id}
            href={href}
            className={`${styles.link} ${active ? styles.linkActive : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label[lang]}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className={styles.header} id="top">
      <div className={styles.headerInner}>
        <Link href={homePath} className={styles.brand} aria-label="Leonardo Briquezi — home">
          <span className={styles.brandMark}>LB</span>
          <span className={styles.brandRule} aria-hidden="true" />
        </Link>

        <nav
          className={styles.desktopNav}
          aria-label={lang === 'en' ? 'Main navigation' : 'Navegação principal'}
        >
          {navItems}
        </nav>

        <div className={styles.headerActions}>
          <div
            className={styles.languageSwitcher}
            role="group"
            aria-label={lang === 'en' ? 'Language' : 'Idioma'}
          >
            {LANG_OPTIONS.map(({ lang: optionLang, label }) => (
              <Link
                key={optionLang}
                href={getLangHref(pathname, optionLang)}
                className={`${styles.languageButton} ${lang === optionLang ? styles.languageActive : ''}`}
                aria-current={lang === optionLang ? 'page' : undefined}
                lang={optionLang}
                onClick={(event) => switchLanguage(event, getLangHref(pathname, optionLang))}
              >
                {label}
              </Link>
            ))}
          </div>
          <Link
            href={`${localePrefix}/contact`}
            className={styles.contactCta}
            onClick={() => setMenuOpen(false)}
          >
            <span>{lang === 'en' ? "LET'S BUILD SOMETHING" : 'VAMOS CONSTRUIR ALGO'}</span>
            <IconArrowRight size={19} stroke={1.5} aria-hidden="true" />
          </Link>
          <button
            ref={menuToggleRef}
            type="button"
            className={styles.menuToggle}
            aria-label={
              menuOpen
                ? lang === 'en'
                  ? 'Close menu'
                  : 'Fechar menu'
                : lang === 'en'
                  ? 'Open menu'
                  : 'Abrir menu'
            }
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>
      </div>
      <div className={styles.mobileMenu} id="mobile-navigation" hidden={!menuOpen}>
        <nav aria-label={lang === 'en' ? 'Mobile navigation' : 'Navegação móvel'}>{navItems}</nav>
        <a
          className={styles.mobileContact}
          href={`mailto:${contact.email}`}
          onClick={() => setMenuOpen(false)}
        >
          {contact.email} <IconArrowRight size={17} />
        </a>
      </div>
    </header>
  );
}
