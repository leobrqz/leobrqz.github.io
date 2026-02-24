'use client';

import { useEffect, useRef, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { loadImageShape } from '@tsparticles/shape-image';
import { loadOpacityUpdater } from '@tsparticles/updater-opacity';
import { loadTwinkleUpdater } from '@tsparticles/updater-twinkle';

const STAR_IMAGE_SRC = '/assets/stars/star1.png';

const CANVAS_WIDTH_DESKTOP = 2560;
const CANVAS_HEIGHT_DESKTOP = 1440;
const CANVAS_WIDTH_MOBILE = 1280;
const CANVAS_HEIGHT_MOBILE = 720;
const MOBILE_BREAKPOINT = 768;
export const SCROLL_PARALLAX_FACTOR = 0.06;

function getCanvasSize(): { w: number; h: number } {
  if (typeof window === 'undefined') {
    return { w: CANVAS_WIDTH_DESKTOP, h: CANVAS_HEIGHT_DESKTOP };
  }
  if (window.innerWidth < MOBILE_BREAKPOINT) {
    return { w: CANVAS_WIDTH_MOBILE, h: CANVAS_HEIGHT_MOBILE };
  }
  return { w: CANVAS_WIDTH_DESKTOP, h: CANVAS_HEIGHT_DESKTOP };
}

function getParticleOptions() {
  return {
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
}

function getCoverScale(canvasW: number, canvasH: number): number {
  if (typeof window === 'undefined') return 1;
  return Math.max(
    window.innerWidth / canvasW,
    window.innerHeight / canvasH
  );
}

export type SpaceBackgroundProps = {
  /** When true, outer wrapper is absolute (no fixed, no scroll). Parent applies parallax. */
  parallaxControlled?: boolean;
};

export function SpaceBackground({ parallaxControlled = false }: SpaceBackgroundProps) {
  const [ready, setReady] = useState(false);
  const [canvasSize, setCanvasSize] = useState(getCanvasSize);
  const [scale, setScale] = useState(() => {
    const size = getCanvasSize();
    return getCoverScale(size.w, size.h);
  });
  const parallaxRef = useRef<HTMLDivElement>(null);
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
    const onResize = () => {
      setCanvasSize(getCanvasSize());
      setScale(getCoverScale(getCanvasSize().w, getCanvasSize().h));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!ready || parallaxControlled) return;

    const onScroll = () => {
      scrollYRef.current = window.scrollY;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = parallaxRef.current;
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
  }, [ready, parallaxControlled]);

  if (!ready) return null;

  const inner = (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: canvasSize.w,
        height: canvasSize.h,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      <Particles
        key={`stars-${canvasSize.w}-${canvasSize.h}`}
        id="space-background-particles"
        options={getParticleOptions()}
      />
    </div>
  );

  if (parallaxControlled) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {inner}
      </div>
    );
  }

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
        ref={parallaxRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {inner}
      </div>
    </div>
  );
}
