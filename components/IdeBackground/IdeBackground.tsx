'use client';

import { useEffect, useRef } from 'react';
import { Box, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { AsteroidLayer } from '@/components/AsteroidLayer';
import { SpaceBackground, SCROLL_PARALLAX_FACTOR } from '@/components/SpaceBackground';

export type IdeBackgroundProps = {
  children: React.ReactNode;
};

const BG_LAYER_SPACE = '/assets/background/background_space.png';
const BG_LAYER_STARS = '/assets/background/background_stars.png';

const STARS_PARALLAX_FACTOR = 0.04;
const TWINKLE_SPEED = 2;
/** Run full twinkle every N frames; lower = less Graphics (getImageData/putImageData) cost. */
const TWINKLE_FRAME_INTERVAL = 12;
/** Only twinkle every Nth pixel in each dimension (1/N² of pixels) to reduce loop cost without resizing canvas. */
const TWINKLE_PIXEL_STEP = 2;
const TWINKLE_MIN = 0.3;
const TWINKLE_AMPLITUDE = 0.5;

const BG_LAYER_BASE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
  imageRendering: 'crisp-edges',
};

/** Tiled at viewport scale so background extends with page height without zooming. */
const BG_LAYER_SPACE_TILED: React.CSSProperties = {
  ...BG_LAYER_BASE,
  backgroundSize: '100vw auto',
  backgroundPosition: '0 0',
  backgroundRepeat: 'repeat',
};

function StarsLayer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);
  const frameCountRef = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const onScroll = () => {
      const y = window.scrollY * STARS_PARALLAX_FACTOR;
      wrapper.style.transform = `translate3d(0, ${y}px, 0)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = BG_LAYER_STARS;
    imgRef.current = img;

    let width = 0;
    let height = 0;

    const runTwinkleOnData = (data: ImageData) => {
      const t = performance.now() * 0.001 * TWINKLE_SPEED;
      const step = TWINKLE_PIXEL_STEP;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const i = (y * width + x) * 4 + 3;
          const a = data.data[i];
          if (a === 0) continue;
          const phase = phaseHash(x * 0.1, y * 0.1);
          const n = 0.5 + 0.5 * Math.sin(t + phase);
          const mul = TWINKLE_MIN + TWINKLE_AMPLITUDE * n;
          data.data[i] = Math.round(a * mul);
        }
      }
    };

    const redrawImmediate = (ctx: CanvasRenderingContext2D) => {
      drawTiled(ctx);
      const data = ctx.getImageData(0, 0, width, height);
      runTwinkleOnData(data);
      ctx.putImageData(data, 0, 0);
    };

    const setCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      width = Math.max(1, w);
      height = Math.max(1, h);
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx && img.complete && img.naturalWidth) {
        redrawImmediate(ctx);
      }
    };

    const drawTiled = (ctx: CanvasRenderingContext2D) => {
      const im = imgRef.current;
      if (!im || !im.naturalWidth) return;
      ctx.imageSmoothingEnabled = false;
      const iw = im.naturalWidth;
      const ih = im.naturalHeight;
      for (let y = 0; y < height; y += ih) {
        for (let x = 0; x < width; x += iw) {
          ctx.drawImage(im, 0, 0, iw, ih, x, y, iw, ih);
        }
      }
    };

    const phaseHash = (x: number, y: number) => {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return (n - Math.floor(n)) * Math.PI * 2;
    };

    const twinkle = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx || !img.complete || !img.naturalWidth) {
        rafRef.current = requestAnimationFrame(twinkle);
        return;
      }
      frameCountRef.current += 1;
      if (frameCountRef.current % TWINKLE_FRAME_INTERVAL === 0) {
        drawTiled(ctx);
        const data = ctx.getImageData(0, 0, width, height);
        runTwinkleOnData(data);
        ctx.putImageData(data, 0, 0);
      }
      rafRef.current = requestAnimationFrame(twinkle);
    };

    img.onload = () => {
      setCanvasSize();
      twinkle();
    };

    setCanvasSize();
    const resizeObserver = new ResizeObserver(() => {
      setCanvasSize();
    });
    resizeObserver.observe(canvas.parentElement!);

    return () => {
      resizeObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      imgRef.current = null;
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        filter: 'blur(0.5px)',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}

const PARALLAX_HEIGHT_FALLBACK = '110vh';
const RESIZE_DEBOUNCE_MS = 120;

export function IdeBackground({ children }: IdeBackgroundProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const resizeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bgColor = isDark ? theme.colors.dark[8] : theme.colors.gray[0];

  useEffect(() => {
    const section = sectionRef.current;
    const container = parallaxContainerRef.current;
    if (!section || !container) return;
    const flushHeight = () => {
      container.style.height = `${section.offsetHeight}px`;
    };
    flushHeight();
    const resizeObserver = new ResizeObserver(() => {
      if (resizeDebounceRef.current) clearTimeout(resizeDebounceRef.current);
      resizeDebounceRef.current = setTimeout(flushHeight, RESIZE_DEBOUNCE_MS);
    });
    resizeObserver.observe(section);
    return () => {
      resizeObserver.disconnect();
      if (resizeDebounceRef.current) clearTimeout(resizeDebounceRef.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = parallaxContainerRef.current;
        if (!el) return;
        const y = -scrollY * SCROLL_PARALLAX_FACTOR;
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
  }, []);

  return (
    <Box
      ref={sectionRef}
      component="section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: bgColor,
      }}
    >
      <div
        ref={parallaxContainerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: PARALLAX_HEIGHT_FALLBACK,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <Box
          component="div"
          aria-hidden
          style={{
            ...BG_LAYER_SPACE_TILED,
            backgroundImage: `url(${BG_LAYER_SPACE})`,
          }}
        />
        <StarsLayer />
        <SpaceBackground parallaxControlled />
      </div>
      <AsteroidLayer />
      <Box style={{ position: 'relative', zIndex: 2 }}>{children}</Box>
    </Box>
  );
}
