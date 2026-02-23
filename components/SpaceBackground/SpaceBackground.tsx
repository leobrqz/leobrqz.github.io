'use client';

import { useEffect, useRef, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { loadImageShape } from '@tsparticles/shape-image';
import { loadOpacityUpdater } from '@tsparticles/updater-opacity';
import { loadTwinkleUpdater } from '@tsparticles/updater-twinkle';

const SCROLL_PARALLAX_FACTOR = 0.06;

const STAR_IMAGE_SRC = '/assets/stars/star1.png';

const options = {
  fullScreen: { enable: false },
  background: { color: 'transparent' },
  particles: {
    number: { value: 120 },
    color: { value: '#ffffff' },
    opacity: {
      value: { min: 0.15, max: 0.95 },
      animation: {
        enable: true,
        speed: { min: 0.4, max: 1.2 },
        sync: false,
        mode: 'random' as const,
        startValue: 'random' as const,
        destroy: 'none' as const,
      },
    },
    size: { value: { min: 5, max: 12 } },
    shape: {
      type: 'image',
      options: {
        image: {
          src: STAR_IMAGE_SRC,
          width: 16,
          height: 16,
          name: 'star1',
          replaceColor: true,
        },
      },
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.08,
        opacity: { min: 0.1, max: 1 },
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
          force: 50,
          smooth: 100,
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
      await loadImageShape(engine);
      await loadOpacityUpdater(engine);
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
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          left: '-50vw',
          top: '-50vh',
          width: '200vw',
          height: '200vh',
        }}
      >
        <Particles id="space-background-particles" options={options} />
      </div>
    </div>
  );
}
