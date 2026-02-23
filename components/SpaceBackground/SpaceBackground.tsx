'use client';

import { useEffect, useRef, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { loadTwinkleUpdater } from '@tsparticles/updater-twinkle';

const SCROLL_PARALLAX_FACTOR = 0.06;

const options = {
  fullScreen: { enable: false },
  background: { color: 'transparent' },
  particles: {
    number: { value: 60 },
    color: { value: '#ffffff' },
    opacity: { value: { min: 0.3, max: 0.9 } },
    size: { value: { min: 1, max: 3 } },
    shape: {
      type: ['circle', 'star', 'text'],
      options: {
        star: { sides: 5, inset: 2 },
        text: { value: ['+'], font: 'Verdana', style: '', weight: '' },
      },
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.05,
        opacity: { min: 0.3, max: 1 },
      },
    },
    move: { speed: 0 },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: [],
        parallax: {
          enable: true,
          force: 12,
          smooth: 16,
        },
      },
    },
  },
};

export function SpaceBackground() {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      await loadTwinkleUpdater(engine);
    }).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current) return;

    const onScroll = () => {
      scrollYRef.current = window.scrollY;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;
        const y = -scrollYRef.current * SCROLL_PARALLAX_FACTOR;
        el.style.transform = `translate3d(0, ${y}px, 0)`;
        rafRef.current = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Particles id="space-background-particles" options={options} />
    </div>
  );
}
