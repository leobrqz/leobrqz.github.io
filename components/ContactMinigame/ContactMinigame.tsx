'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Application, Assets, Container, Graphics, Rectangle, Sprite, Texture } from 'pixi.js';
import { Howl } from 'howler';
import { Box, Button, Stack, Text } from '@mantine/core';
import { generateAsteroidShape, type AsteroidVertex } from '@/components/AsteroidLayer/asteroidShape';
import {
  ASTEROID_BASE_SPEED,
  ASTEROID_RADIUS_MAX,
  ASTEROID_RADIUS_MIN,
  ASTEROID_SPAWN_INTERVAL_MS_MAX,
  ASTEROID_SPAWN_INTERVAL_MS_MIN,
  ASTEROID_SPAWN_MARGIN,
  BULLET_COOLDOWN_MS,
  BULLET_HEIGHT,
  BULLET_SPEED,
  BULLET_WIDTH,
  BULLET_CORNER_RADIUS,
  GAME_HEIGHT,
  GAME_WIDTH,
  getBestScore,
  HIT_SOUND,
  LIVES_MAX,
  PADDING,
  setBestScore,
  SHIP_FRAME_HEIGHT,
  SHIP_FRAME_PADDING,
  SHIP_FRAME_WIDTH,
  SHIP_HALF_SIZE,
  SHIP_IDLE_FRAME_COUNT,
  SHIP_IDLE_FRAME_MS,
  SHIP_ROTATION_OFFSET,
  SHIP_SPEED,
  SHIP_SPRITE_SHEET_URL,
  SHOOT_SOUND,
  speedMultiplier,
} from './constants';

type GameState = 'idle' | 'playing' | 'gameover';

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

function circleIntersectsPolygon(
  cx: number,
  cy: number,
  r: number,
  vertices: { x: number; y: number }[],
  scale: number,
  px: number,
  py: number
): boolean {
  if (pointInPolygon(cx, cy, vertices, scale, px, py)) return true;
  for (let i = 0; i < vertices.length; i++) {
    const vx = px + vertices[i].x * scale;
    const vy = py + vertices[i].y * scale;
    if ((vx - cx) ** 2 + (vy - cy) ** 2 <= r * r) return true;
  }
  return false;
}

interface MinigameAsteroid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  shape: AsteroidVertex[];
  radius: number;
  graphics: Graphics;
}

interface MinigameBullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  graphics: Graphics;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  graphics: Graphics;
}

let nextAsteroidId = 1;

export function ContactMinigame() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [bestScore, setBestScoreState] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES_MAX);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const shipPosRef = useRef({ x: GAME_WIDTH * 0.2, y: GAME_HEIGHT / 2 });
  const shipGraphicsRef = useRef<Graphics | Sprite | null>(null);
  const shipIdleFramesRef = useRef<Texture[]>([]);
  const shipIdleFrameIndexRef = useRef(0);
  const shipIdleFrameTimeRef = useRef(0);
  const asteroidsRef = useRef<MinigameAsteroid[]>([]);
  const bulletsRef = useRef<MinigameBullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastSpawnTimeRef = useRef(0);
  const lastShootTimeRef = useRef(0);
  const shootHowlRef = useRef<Howl | null>(null);
  const hitHowlRef = useRef<Howl | null>(null);
  const gameContainerRef = useRef<Container | null>(null);
  const gameStateRef = useRef<GameState>('idle');
  const scoreRef = useRef(0);
  const livesRef = useRef(LIVES_MAX);
  const shipAngleRef = useRef(0);

  const minX = PADDING + SHIP_HALF_SIZE;
  const maxX = GAME_WIDTH - PADDING - SHIP_HALF_SIZE;
  const minY = PADDING + SHIP_HALF_SIZE;
  const maxY = GAME_HEIGHT - PADDING - SHIP_HALF_SIZE;

  useEffect(() => {
    setBestScoreState(getBestScore());
  }, []);

  const playShootSound = useCallback(() => {
    try {
      if (!shootHowlRef.current) {
        shootHowlRef.current = new Howl({
          src: [SHOOT_SOUND],
          volume: 0.5,
          onloaderror: () => {},
          onplayerror: () => {},
        });
      }
      shootHowlRef.current.play();
    } catch {
      // no-op
    }
  }, []);

  const playHitSound = useCallback(() => {
    try {
      if (!hitHowlRef.current) {
        hitHowlRef.current = new Howl({
          src: [HIT_SOUND],
          volume: 0.30,
          onloaderror: () => {},
          onplayerror: () => {},
        });
      }
      hitHowlRef.current.play();
    } catch {
      // no-op
    }
  }, []);

  const destroyApp = useCallback(() => {
    const app = appRef.current;
    if (app) {
      try {
        app.destroy(true, { children: true });
      } catch {
        // ignore
      }
      appRef.current = null;
      shipGraphicsRef.current = null;
      asteroidsRef.current = [];
      bulletsRef.current = [];
      particlesRef.current = [];
      if (canvasContainerRef.current && canvasContainerRef.current.firstChild) {
        canvasContainerRef.current.removeChild(canvasContainerRef.current.firstChild);
      }
    }
  }, []);

  const startGame = useCallback(async (restart = false) => {
    if (!restart && gameState === 'playing') return;
    const container = canvasContainerRef.current;
    if (!container) return;

    destroyApp();

    keysRef.current = {};
    shipPosRef.current = { x: GAME_WIDTH * 0.2, y: GAME_HEIGHT / 2 };
    shipAngleRef.current = 0;
    setScore(0);
    setLives(LIVES_MAX);
    setGameState('playing');

    const app = new Application();
    await app.init({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      antialias: true,
    });
    container.appendChild(app.canvas);
    appRef.current = app;

    gameStateRef.current = 'playing';
    scoreRef.current = 0;
    livesRef.current = LIVES_MAX;

    const gameContainer = new Container();
    app.stage.addChild(gameContainer);
    gameContainerRef.current = gameContainer;

    const boundary = new Graphics();
    boundary.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    boundary.stroke({ width: 2, color: 0xffffff });
    gameContainer.addChild(boundary);

    const fullTexture = await Assets.load(SHIP_SPRITE_SHEET_URL);
    const strideX = SHIP_FRAME_WIDTH + SHIP_FRAME_PADDING;
    const maxFramesX = Math.floor((fullTexture.source.width + SHIP_FRAME_PADDING) / strideX);
    const idleFrameCount = Math.max(1, Math.min(SHIP_IDLE_FRAME_COUNT, maxFramesX));
    const idleFrames: Texture[] = [];
    for (let i = 0; i < idleFrameCount; i++) {
      idleFrames.push(
        new Texture({
          source: fullTexture.source,
          frame: new Rectangle(i * strideX, 0, SHIP_FRAME_WIDTH, SHIP_FRAME_HEIGHT),
        })
      );
    }
    shipIdleFramesRef.current = idleFrames;
    shipIdleFrameIndexRef.current = 0;
    shipIdleFrameTimeRef.current = performance.now();
    const shipG = new Sprite({ texture: idleFrames[0], anchor: 0.5 });
    shipG.x = shipPosRef.current.x;
    shipG.y = shipPosRef.current.y;
    shipG.rotation = SHIP_ROTATION_OFFSET;
    gameContainer.addChild(shipG);
    shipGraphicsRef.current = shipG;
    shipAngleRef.current = 0;

    asteroidsRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];
    lastSpawnTimeRef.current = performance.now();
    lastShootTimeRef.current = 0;

    app.ticker.add((ticker) => {
      if (gameStateRef.current !== 'playing') return;

      const dt = ticker.deltaMS / 1000;
      const now = performance.now();
      const currentScore = scoreRef.current;
      const mult = speedMultiplier(currentScore);

      const ship = shipPosRef.current;
      const keys = keysRef.current;
      if (keys['ArrowUp']) ship.y = Math.max(minY, ship.y - SHIP_SPEED * dt);
      if (keys['ArrowDown']) ship.y = Math.min(maxY, ship.y + SHIP_SPEED * dt);
      if (keys['ArrowLeft']) ship.x = Math.max(minX, ship.x - SHIP_SPEED * dt);
      if (keys['ArrowRight']) ship.x = Math.min(maxX, ship.x + SHIP_SPEED * dt);

      let aimAngle = shipAngleRef.current;
      const up = keys['ArrowUp'];
      const down = keys['ArrowDown'];
      const left = keys['ArrowLeft'];
      const right = keys['ArrowRight'];
      if (up || down || left || right) {
        let dx = 0;
        let dy = 0;
        if (right) dx += 1;
        if (left) dx -= 1;
        if (up) dy -= 1;
        if (down) dy += 1;
        aimAngle = Math.atan2(dy, dx);
        shipAngleRef.current = aimAngle;
      }

      const sg = shipGraphicsRef.current;
      if (sg && !sg.destroyed) {
        sg.x = ship.x;
        sg.y = ship.y;
        sg.rotation = aimAngle + SHIP_ROTATION_OFFSET;
        const idleFrames = shipIdleFramesRef.current;
        if (idleFrames.length > 1) {
          if (now - shipIdleFrameTimeRef.current >= SHIP_IDLE_FRAME_MS) {
            shipIdleFrameTimeRef.current = now;
            shipIdleFrameIndexRef.current =
              (shipIdleFrameIndexRef.current + 1) % idleFrames.length;
            if (sg instanceof Sprite) {
              sg.texture = idleFrames[shipIdleFrameIndexRef.current];
            }
          }
        }
      }

      if (keys[' '] && now - lastShootTimeRef.current >= BULLET_COOLDOWN_MS) {
        lastShootTimeRef.current = now;
        const cos = Math.cos(aimAngle);
        const sin = Math.sin(aimAngle);
        const noseX = ship.x + SHIP_HALF_SIZE * cos;
        const noseY = ship.y + SHIP_HALF_SIZE * sin;
        const vx = BULLET_SPEED * cos;
        const vy = BULLET_SPEED * sin;
        const bulletG = new Graphics();
        bulletG
          .roundRect(-BULLET_WIDTH / 2, -BULLET_HEIGHT / 2, BULLET_WIDTH, BULLET_HEIGHT, BULLET_CORNER_RADIUS)
          .fill(0xff0000);
        bulletG.x = noseX;
        bulletG.y = noseY;
        bulletG.rotation = aimAngle;
        gameContainer.addChild(bulletG);
        bulletsRef.current.push({
          x: noseX,
          y: noseY,
          vx,
          vy,
          graphics: bulletG,
        });
        playShootSound();
      }

      if (now - lastSpawnTimeRef.current >= ASTEROID_SPAWN_INTERVAL_MS_MIN + Math.random() * (ASTEROID_SPAWN_INTERVAL_MS_MAX - ASTEROID_SPAWN_INTERVAL_MS_MIN)) {
        lastSpawnTimeRef.current = now;
        const radius = ASTEROID_RADIUS_MIN + Math.random() * (ASTEROID_RADIUS_MAX - ASTEROID_RADIUS_MIN);
        const speed = ASTEROID_BASE_SPEED * mult * (0.8 + Math.random() * 0.4);
        const vy = (Math.random() - 0.5) * 30;
        const shape = generateAsteroidShape();
        const points: number[] = [];
        for (const v of shape) {
          points.push(v.x * radius, v.y * radius);
        }
        const asteroidG = new Graphics();
        asteroidG.poly(points).stroke({ width: 2, color: 0xcccccc });
        asteroidG.x = GAME_WIDTH + ASTEROID_SPAWN_MARGIN;
        asteroidG.y = PADDING + Math.random() * (GAME_HEIGHT - 2 * PADDING);
        gameContainer.addChild(asteroidG);
        asteroidsRef.current.push({
          id: nextAsteroidId++,
          x: asteroidG.x,
          y: asteroidG.y,
          vx: -speed,
          vy,
          shape,
          radius,
          graphics: asteroidG,
        });
      }

      const asteroids = asteroidsRef.current;
      for (const a of asteroids) {
        a.x += a.vx * dt;
        a.y += a.vy * dt;
        if (!a.graphics.destroyed) {
          a.graphics.x = a.x;
          a.graphics.y = a.y;
        }
      }

      const bullets = bulletsRef.current;
      for (const b of bullets) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (!b.graphics.destroyed) {
          b.graphics.x = b.x;
          b.graphics.y = b.y;
        }
      }

      const toRemoveBullets: MinigameBullet[] = [];
      for (const b of bullets) {
        if (
          b.x < -20 ||
          b.x > GAME_WIDTH + 20 ||
          b.y < -20 ||
          b.y > GAME_HEIGHT + 20
        ) {
          toRemoveBullets.push(b);
          if (!b.graphics.destroyed) b.graphics.destroy();
          continue;
        }
        for (let i = asteroids.length - 1; i >= 0; i--) {
          const a = asteroids[i];
          if (pointInPolygon(b.x, b.y, a.shape, a.radius, a.x, a.y)) {
            toRemoveBullets.push(b);
            if (!b.graphics.destroyed) b.graphics.destroy();
            scoreRef.current += 1;
            setScore(scoreRef.current);
            playHitSound();
            const count = 8 + Math.floor(Math.random() * 8);
            const maxLife = 0.35 + Math.random() * 0.25;
            for (let p = 0; p < count; p++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 60 + Math.random() * 80;
              const g = new Graphics();
              g.circle(0, 0, 2).fill(0xffffff);
              g.x = a.x;
              g.y = a.y;
              gameContainer.addChild(g);
              particlesRef.current.push({
                x: a.x,
                y: a.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: maxLife,
                maxLife,
                graphics: g,
              });
            }
            asteroids.splice(i, 1);
            if (!a.graphics.destroyed) a.graphics.destroy();
            break;
          }
        }
      }
      bulletsRef.current = bullets.filter((bb) => !toRemoveBullets.includes(bb));
      asteroidsRef.current = asteroids.filter((a) => a.x > -a.radius - 20);

      const shipX = shipPosRef.current.x;
      const shipY = shipPosRef.current.y;
      const hitAsteroids: MinigameAsteroid[] = [];
      for (const a of asteroids) {
        if (circleIntersectsPolygon(shipX, shipY, SHIP_HALF_SIZE, a.shape, a.radius, a.x, a.y)) {
          hitAsteroids.push(a);
        }
      }
      const hit = hitAsteroids.length > 0;
      if (hit) {
        const hitSet = new Set(hitAsteroids);
        for (const a of hitAsteroids) {
          if (!a.graphics.destroyed) a.graphics.destroy();
        }
        asteroidsRef.current = asteroidsRef.current.filter((a) => !hitSet.has(a));
        for (let p = 0; p < 5; p++) {
          const angle = Math.random() * Math.PI * 2;
          const g = new Graphics();
          g.circle(0, 0, 2).fill(0xff8844);
          g.x = shipX;
          g.y = shipY;
          gameContainer.addChild(g);
          particlesRef.current.push({
            x: shipX,
            y: shipY,
            vx: Math.cos(angle) * 40,
            vy: Math.sin(angle) * 40,
            life: 0.3,
            maxLife: 0.3,
            graphics: g,
          });
        }
      }
      if (hit) {
        const newLives = livesRef.current - 1;
        livesRef.current = newLives;
        setLives(newLives);
        if (newLives <= 0) {
          shipGraphicsRef.current = null;
          const finalScore = scoreRef.current;
          const best = getBestScore();
          if (finalScore > best) {
            setBestScore(finalScore);
            setBestScoreState(finalScore);
          }
          gameStateRef.current = 'gameover';
          setGameState('gameover');
        }
      }

      const particles = particlesRef.current;
      const particlesToKeep: Particle[] = [];
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (!p.graphics.destroyed) {
          p.graphics.x = p.x;
          p.graphics.y = p.y;
          p.graphics.alpha = Math.max(0, p.life / p.maxLife);
        }
        if (p.life > 0) {
          particlesToKeep.push(p);
        } else {
          if (!p.graphics.destroyed) p.graphics.destroy();
        }
      }
      particlesRef.current = particlesToKeep;
    });
  }, [destroyApp, playShootSound, playHitSound]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') e.preventDefault();
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      keysRef.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    return () => {
      destroyApp();
    };
  }, [destroyApp]);

  const handlePlayAgain = useCallback(() => {
    destroyApp();
    startGame(false);
  }, [destroyApp, startGame]);

  const handleRestart = useCallback(() => {
    startGame(true);
  }, [startGame]);

  const showIdleOverlay = gameState === 'idle';
  const showGameOverOverlay = gameState === 'gameover';
  const showHudBar = gameState === 'playing' || gameState === 'gameover';

  return (
    <Box w="100%" py="md" style={{ position: 'relative' }}>
      {showHudBar && (
        <Box
          style={{
            width: GAME_WIDTH,
            margin: '0 auto',
            padding: '8px 8px 4px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text size="sm" fw={600}>
            Score: {score}
          </Text>
          <Button onClick={handleRestart} size="xs" variant="light">
            Restart
          </Button>
          <Text size="sm" fw={600}>
            Lives: {lives}
          </Text>
        </Box>
      )}
      <Box
        ref={canvasContainerRef}
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
        }}
        tabIndex={0}
      />
      {showIdleOverlay && (
        <Stack
          gap="md"
          align="center"
          justify="center"
          style={{
            position: 'absolute',
            inset: 0,
            margin: '0 auto',
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            pointerEvents: 'none',
          }}
        >
          <Text size="sm" c="dimmed">
            Best: {bestScore}
          </Text>
          <Box style={{ pointerEvents: 'auto' }}>
            <Button onClick={() => startGame(false)} size="md">
              Play
            </Button>
          </Box>
        </Stack>
      )}
      {showGameOverOverlay && (
        <Stack
          gap="md"
          align="center"
          justify="center"
          style={{
            position: 'absolute',
            inset: 0,
            margin: '0 auto',
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            pointerEvents: 'none',
          }}
        >
          <Text fw={700} size="lg">
            Game over
          </Text>
          <Text size="sm">
            Score: {score} · Best: {bestScore}
          </Text>
          <Box style={{ pointerEvents: 'auto' }}>
            <Button onClick={handlePlayAgain} size="md">
              Play again
            </Button>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
