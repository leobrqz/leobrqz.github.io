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
const STARS_CANVAS_MAX = 1024;
const TWINKLE_SPEED = 2;
const TWINKLE_MIN = 0.3;
const TWINKLE_AMPLITUDE = 0.5;

const BG_LAYER_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
  imageRendering: 'crisp-edges',
};

function StarsLayer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);

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

    const setCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const scale = Math.min(1, STARS_CANVAS_MAX / Math.max(w, h));
      width = Math.max(1, Math.floor(w * scale));
      height = Math.max(1, Math.floor(h * scale));
      canvas.width = width;
      canvas.height = height;
    };

    const drawCover = (ctx: CanvasRenderingContext2D) => {
      const im = imgRef.current;
      if (!im || !im.naturalWidth) return;
      ctx.imageSmoothingEnabled = false;
      const iw = im.naturalWidth;
      const ih = im.naturalHeight;
      const scale = Math.max(width / iw, height / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (width - sw) / 2;
      const sy = (height - sh) / 2;
      ctx.drawImage(im, 0, 0, iw, ih, sx, sy, sw, sh);
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
      drawCover(ctx);
      const data = ctx.getImageData(0, 0, width, height);
      const t = performance.now() * 0.001 * TWINKLE_SPEED;
      for (let i = 3; i < data.data.length; i += 4) {
        const a = data.data[i];
        if (a === 0) continue;
        const x = (i / 4) % width;
        const y = Math.floor(i / 4 / width);
        const phase = phaseHash(x * 0.1, y * 0.1);
        const n = 0.5 + 0.5 * Math.sin(t + phase);
        const mul = TWINKLE_MIN + TWINKLE_AMPLITUDE * n;
        data.data[i] = Math.round(a * mul);
      }
      ctx.putImageData(data, 0, 0);
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

export function IdeBackground({ children }: IdeBackgroundProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const parallaxContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const bgColor = isDark ? theme.colors.dark[8] : theme.colors.gray[0];

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
          height: '110vh',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <Box
          component="div"
          aria-hidden
          style={{
            ...BG_LAYER_STYLE,
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
