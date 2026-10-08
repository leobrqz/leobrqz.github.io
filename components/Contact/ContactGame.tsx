'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { type Lang } from '@/lib/i18n';
import styles from './ContactPage.module.css';

const ContactMinigame = dynamic(
  () => import('@/components/ContactMinigame').then((module) => module.ContactMinigame),
  { ssr: false }
);

export function ContactGame({ lang }: { lang: Lang }) {
  const frame = useRef<HTMLDivElement>(null);
  const [canFitGame, setCanFitGame] = useState(false);

  useEffect(() => {
    const container = frame.current;
    if (!container) {
      return;
    }

    const desktop = window.matchMedia('(min-width: 768px)');
    const update = () => setCanFitGame(desktop.matches && container.clientWidth >= 800);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(container);
    window.addEventListener('resize', update);
    desktop.addEventListener('change', update);
    update();

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', update);
      desktop.removeEventListener('change', update);
    };
  }, []);

  return (
    <div ref={frame} className={styles.gameFrame}>
      {canFitGame && (
        <section className={styles.gameSection} aria-labelledby="contact-game-title">
          <div className={styles.gameHeading}>
            <h2 id="contact-game-title">Asteroids</h2>
            <p>
              {lang === 'en'
                ? 'Arrow keys to move; Space to fire'
                : 'Use as setas para mover; Espaço para atirar'}
            </p>
          </div>
          <ContactMinigame />
        </section>
      )}
    </div>
  );
}
