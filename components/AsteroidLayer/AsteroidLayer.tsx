'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import {
  generateAsteroidShape,
  type AsteroidVertex,
} from '@/components/AsteroidLayer/asteroidShape';

const BASE_RADIUS_MIN = 24;
const BASE_RADIUS_MAX = 40;
const SPEED_PX_PER_MS = 0.22;
const SPAWN_MARGIN = 20;
const SPAWN_DELAY_MS_MIN = 60000;
const SPAWN_DELAY_MS_RANGE = 60000;
const OFF_SCREEN_MARGIN = 50;

interface Asteroid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  shape: AsteroidVertex[];
  radius: number;
}

interface BreakParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface FloatText {
  x: number;
  y: number;
  startTime: number;
  duration: number;
}

let nextId = 1;
let asteroidScore = 0;

function pointInPolygon(
  px: number,
  py: number,
  vertices: { x: number; y: number }[],
  scale: number,
  cx: number,
  cy: number
): boolean {
  let inside = false;
  const n = vertices.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = cx + vertices[i].x * scale;
    const yi = cy + vertices[i].y * scale;
    const xj = cx + vertices[j].x * scale;
    const yj = cy + vertices[j].y * scale;
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

const POP_SOUND_PATH = '/sounds/mixkit-short-laser-gun-shot-1670.wav';

const WORKER_PATH = '/asteroidLayer.worker.js';

function useWorkerAsteroidLayer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  setWorkerActive: (active: boolean) => void,
  canvasTransferredRef?: React.MutableRefObject<boolean> | null
) {
  const workerRef = useRef<Worker | null>(null);
  const lastSizeRef = useRef({ w: 0, h: 0 });
  const howlRef = useRef<Howl | null>(null);

  const playPop = useCallback(() => {
    try {
      if (!howlRef.current) {
        howlRef.current = new Howl({
          src: [POP_SOUND_PATH],
          volume: 0.6,
          onloaderror: () => {},
          onplayerror: () => {},
        });
      }
      howlRef.current.play();
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      !canvas ||
      typeof canvas.transferControlToOffscreen !== 'function'
    ) {
      return;
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    lastSizeRef.current = { w, h };
    canvas.width = w;
    canvas.height = h;
    if (canvasTransferredRef) canvasTransferredRef.current = true;
    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(WORKER_PATH);
    workerRef.current = worker;
    setWorkerActive(true);
    worker.postMessage(
      { type: 'init', offscreenCanvas: offscreen, width: w, height: h },
      [offscreen]
    );
    worker.onmessage = (e: MessageEvent<{ type: string; value?: number }>) => {
      if (e.data.type === 'playPop') playPop();
      if (e.data.type === 'score') console.log('Asteroid score:', e.data.value);
    };

    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      lastSizeRef.current = { w: nw, h: nh };
      worker.postMessage({ type: 'resize', width: nw, height: nh });
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (canvasTransferredRef) canvasTransferredRef.current = false;
      setWorkerActive(false);
      window.removeEventListener('resize', onResize);
      worker.postMessage({ type: 'resize', width: 0, height: 0 });
      worker.terminate();
      workerRef.current = null;
    };
  }, [canvasRef, playPop, setWorkerActive, canvasTransferredRef]);

  return { workerRef, lastSizeRef };
}

export function AsteroidLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasTransferredRef = useRef(false);
  const [workerActive, setWorkerActive] = useState(false);

  const { workerRef, lastSizeRef } = useWorkerAsteroidLayer(
    canvasRef,
    setWorkerActive,
    canvasTransferredRef
  );

  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const asteroidsRef = useRef<Asteroid[]>([]);
  const particlesRef = useRef<BreakParticle[]>([]);
  const floatTextsRef = useRef<FloatText[]>([]);
  const spawnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spawnScheduledRef = useRef(false);
  const howlRef = useRef<Howl | null>(null);

  const spawnOne = useCallback((force = false) => {
    if (!force && asteroidsRef.current.length > 0) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const radius =
      BASE_RADIUS_MIN +
      Math.random() * (BASE_RADIUS_MAX - BASE_RADIUS_MIN);
    const edge = Math.floor(Math.random() * 4);
    let x: number, y: number, vx: number, vy: number;
    const angle = Math.random() * Math.PI * 0.6 + Math.PI * 0.2;
    switch (edge) {
      case 0:
        x = Math.random() * w;
        y = -radius - SPAWN_MARGIN;
        vx = Math.cos(angle) * SPEED_PX_PER_MS * (Math.random() > 0.5 ? 1 : -1);
        vy = SPEED_PX_PER_MS * (0.3 + Math.random() * 0.7);
        break;
      case 1:
        x = w + radius + SPAWN_MARGIN;
        y = Math.random() * h;
        vx = -SPEED_PX_PER_MS * (0.3 + Math.random() * 0.7);
        vy = Math.sin(angle) * SPEED_PX_PER_MS * (Math.random() > 0.5 ? 1 : -1);
        break;
      case 2:
        x = Math.random() * w;
        y = h + radius + SPAWN_MARGIN;
        vx = Math.cos(angle) * SPEED_PX_PER_MS * (Math.random() > 0.5 ? 1 : -1);
        vy = -SPEED_PX_PER_MS * (0.3 + Math.random() * 0.7);
        break;
      default:
        x = -radius - SPAWN_MARGIN;
        y = Math.random() * h;
        vx = SPEED_PX_PER_MS * (0.3 + Math.random() * 0.7);
        vy = Math.sin(angle) * SPEED_PX_PER_MS * (Math.random() > 0.5 ? 1 : -1);
    }
    const len = Math.hypot(vx, vy);
    vx /= len;
    vy /= len;
    const speed = SPEED_PX_PER_MS * (0.8 + Math.random() * 0.4);
    asteroidsRef.current.push({
      id: nextId++,
      x,
      y,
      vx: vx * speed,
      vy: vy * speed,
      shape: generateAsteroidShape(),
      radius,
    });
  }, []);

  const scheduleSpawn = useCallback(() => {
    if (spawnScheduledRef.current) return;
    spawnScheduledRef.current = true;
    spawnTimeoutRef.current = setTimeout(() => {
      spawnScheduledRef.current = false;
      spawnOne(false);
    }, SPAWN_DELAY_MS_MIN + Math.random() * SPAWN_DELAY_MS_RANGE);
  }, [spawnOne]);

  const playPopSound = useCallback(() => {
    try {
      if (!howlRef.current) {
        howlRef.current = new Howl({
          src: [POP_SOUND_PATH],
          volume: 0.6,
          onloaderror: () => {},
          onplayerror: () => {},
        });
      }
      howlRef.current.play();
    } catch {
      // no-op
    }
  }, []);

  const tryExplodeAt = useCallback(
    (px: number, py: number): boolean => {
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'click', px, py });
        return false;
      }
      const asteroids = asteroidsRef.current;
      for (let i = 0; i < asteroids.length; i++) {
        const a = asteroids[i];
        if (pointInPolygon(px, py, a.shape, a.radius, a.x, a.y)) {
          asteroidsRef.current = asteroids.filter((ast) => ast.id !== a.id);

          const particleCount = 8 + Math.floor(Math.random() * 7);
          const maxLife = 400 + Math.random() * 300;
          for (let p = 0; p < particleCount; p++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.1 + Math.random() * 0.2;
            particlesRef.current.push({
              x: a.x + (Math.random() - 0.5) * a.radius,
              y: a.y + (Math.random() - 0.5) * a.radius,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: maxLife,
              maxLife,
            });
          }

          floatTextsRef.current.push({
            x: px,
            y: py,
            startTime: Date.now(),
            duration: 800,
          });

          asteroidScore += 1;
          playPopSound();
          scheduleSpawn();
          return true;
        }
      }
      return false;
    },
    [playPopSound, scheduleSpawn]
  );

  useEffect(() => {
    const win = window as Window & { __printAsteroidScore?: () => void };
    win.__printAsteroidScore = () => {
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'getScore' });
      } else {
        console.log('Asteroid score:', asteroidScore);
      }
    };
    return () => {
      delete win.__printAsteroidScore;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        target &&
        document.body.contains(target) &&
        (target instanceof HTMLAnchorElement ||
          target instanceof HTMLButtonElement ||
          (target instanceof HTMLElement &&
            (target.closest('a') ||
              target.closest('button') ||
              target.closest('[role="button"]'))))
      ) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const isWorker = !!workerRef.current;
      const scaleX = isWorker
        ? lastSizeRef.current.w / rect.width
        : canvas.width / rect.width;
      const scaleY = isWorker
        ? lastSizeRef.current.h / rect.height
        : canvas.height / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top) * scaleY;

      const consumed = tryExplodeAt(px, py);
      if (consumed) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () =>
      document.removeEventListener('click', handleDocumentClick, true);
  }, [tryExplodeAt]);

  useEffect(() => {
    if (workerActive) return;
    scheduleSpawn();
    return () => {
      if (spawnTimeoutRef.current) {
        clearTimeout(spawnTimeoutRef.current);
        spawnTimeoutRef.current = null;
      }
      spawnScheduledRef.current = false;
    };
  }, [workerActive, scheduleSpawn]);

  useEffect(() => {
    const win = window as Window & { __forceAsteroidSpawn?: () => void };
    win.__forceAsteroidSpawn = () => {
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'forceSpawn' });
      } else {
        spawnOne(true);
      }
    };
    return () => {
      delete win.__forceAsteroidSpawn;
    };
  }, [spawnOne]);

  useEffect(() => {
    if (workerActive || canvasTransferredRef?.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      if (canvasTransferredRef?.current) return;
      try {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } catch {
        // Canvas was transferred to worker; resize is handled there
      }
    };
    setSize();
    window.addEventListener('resize', setSize);

    return () => window.removeEventListener('resize', setSize);
  }, [workerActive]);

  useEffect(() => {
    if (workerActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let mounted = true;

    const loop = (now: number) => {
      if (!mounted || !canvasRef.current) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;
      const deltaMs = lastTimeRef.current ? now - lastTimeRef.current : 16;
      lastTimeRef.current = now;

      ctx.clearRect(0, 0, w, h);

      const asteroids = asteroidsRef.current;
      for (const a of asteroids) {
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        const s = a.shape;
        ctx.moveTo(s[0].x * a.radius, s[0].y * a.radius);
        for (let i = 1; i < s.length; i++) {
          ctx.lineTo(s[i].x * a.radius, s[i].y * a.radius);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      const particles = particlesRef.current;
      for (const p of particles) {
        const alpha = p.life / p.maxLife;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      const floatTexts = floatTextsRef.current;
      const nowMs = Date.now();
      for (const f of floatTexts) {
        const elapsed = nowMs - f.startTime;
        if (elapsed >= f.duration) continue;
        const t = elapsed / f.duration;
        const yOffset = t * 40;
        const opacity = 1 - t;
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+1', f.x, f.y - yOffset);
      }
      ctx.textAlign = 'left';

      asteroidsRef.current = asteroids.filter((a) => {
        a.x += a.vx * deltaMs;
        a.y += a.vy * deltaMs;
        const inBounds =
          a.x + a.radius > -OFF_SCREEN_MARGIN &&
          a.x - a.radius < w + OFF_SCREEN_MARGIN &&
          a.y + a.radius > -OFF_SCREEN_MARGIN &&
          a.y - a.radius < h + OFF_SCREEN_MARGIN;
        if (!inBounds && spawnScheduledRef.current === false) {
          scheduleSpawn();
        }
        return inBounds;
      });

      particlesRef.current = particles.filter((p) => {
        p.x += p.vx * deltaMs;
        p.y += p.vy * deltaMs;
        p.life -= deltaMs;
        return p.life > 0;
      });

      floatTextsRef.current = floatTexts.filter(
        (f) => nowMs - f.startTime < f.duration
      );

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [workerActive, scheduleSpawn]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
