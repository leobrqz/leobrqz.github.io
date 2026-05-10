'use client';

import { useEffect, useRef } from 'react';
import { useThemeContext } from '@/components/ThemeProvider';

function mag(a: number, b: number) {
  return Math.sqrt(a * a + b * b);
}

const SIZE = 400;

export function GenerativeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const { theme } = useThemeContext();

  const isNerv = theme === 'nerv';
  const fgR = isNerv ? 135 : 212;
  const fgG = isNerv ? 255 : 121;
  const fgB = isNerv ? 95 : 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const col = (a: number) => `rgba(${fgR},${fgG},${fgB},${a})`;

    const draw = () => {
      const t = timeRef.current;

      ctx.clearRect(0, 0, SIZE, SIZE);

      for (let i = 0; i < 10000; i++) {
        const x = i;
        const y = i / 235;
        const k = 4 * Math.cos(x / 21);
        const e = y / 8 - 20;
        const d = mag(k, e);
        const q =
          3 * Math.sin(k * 2) +
          0.3 / Math.max(k, 0.001) +
          Math.sin(y / 19) * k * (9 + 2 * Math.sin(e * 14 - d * 3 + t * 2));
        const c = d - t;
        const px = q + 50 * Math.cos(c) + 200;
        const py = q * Math.sin(c) + d * 39 - 475;
        const rad = k * k > 15 ? 2 : 1;

        ctx.fillStyle = col(0.45);
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      timeRef.current += Math.PI / 240;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [fgR, fgG, fgB]);

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
