/**
 * Self-contained worker for AsteroidLayer (random spawn asteroids).
 * Runs physics and drawing on a separate thread from StarsLayer/tsparticles.
 */
const BASE_RADIUS_MIN = 24;
const BASE_RADIUS_MAX = 40;
const SPEED_PX_PER_MS = 0.22;
const SPAWN_MARGIN = 20;
const SPAWN_DELAY_MS_MIN = 60000;
const SPAWN_DELAY_MS_RANGE = 60000;
const OFF_SCREEN_MARGIN = 50;
const VERTEX_COUNT = 10;
const RADIUS_MIN = 0.7;
const RADIUS_RANGE = 0.6;
const ANGLE_JITTER = 0.12;

function generateAsteroidShape() {
  const vertices = [];
  for (let i = 0; i < VERTEX_COUNT; i++) {
    const angle =
      (i * (2 * Math.PI)) / VERTEX_COUNT + (Math.random() - 0.5) * ANGLE_JITTER;
    const r = RADIUS_MIN + Math.random() * RADIUS_RANGE;
    vertices.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }
  return vertices;
}

function pointInPolygon(px, py, vertices, scale, cx, cy) {
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

let ctx = null;
let offscreenCanvas = null;
let canvasWidth = 0;
let canvasHeight = 0;
let asteroids = [];
let particles = [];
let floatTexts = [];
let nextId = 1;
let spawnScheduled = false;
let spawnTimeoutId = null;
let lastTime = 0;
let loopIntervalId = null;
let asteroidScore = 0;

function spawnOne(force) {
  if (!force && asteroids.length > 0) return;
  const w = canvasWidth || 800;
  const h = canvasHeight || 600;
  const radius = BASE_RADIUS_MIN + Math.random() * (BASE_RADIUS_MAX - BASE_RADIUS_MIN);
  const edge = Math.floor(Math.random() * 4);
  let x, y, vx, vy;
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
  asteroids.push({
    id: nextId++,
    x,
    y,
    vx: vx * speed,
    vy: vy * speed,
    shape: generateAsteroidShape(),
    radius,
  });
}

function scheduleSpawn() {
  if (spawnScheduled) return;
  spawnScheduled = true;
  spawnTimeoutId = self.setTimeout(() => {
    spawnScheduled = false;
    spawnOne(false);
  }, SPAWN_DELAY_MS_MIN + Math.random() * SPAWN_DELAY_MS_RANGE);
}

function tryExplodeAt(px, py) {
  for (let i = 0; i < asteroids.length; i++) {
    const a = asteroids[i];
    if (pointInPolygon(px, py, a.shape, a.radius, a.x, a.y)) {
      asteroids = asteroids.filter(function (ast) {
        return ast.id !== a.id;
      });
      const particleCount = 8 + Math.floor(Math.random() * 7);
      const maxLife = 400 + Math.random() * 300;
      for (let p = 0; p < particleCount; p++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.1 + Math.random() * 0.2;
        particles.push({
          x: a.x + (Math.random() - 0.5) * a.radius,
          y: a.y + (Math.random() - 0.5) * a.radius,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: maxLife,
          maxLife: maxLife,
        });
      }
      floatTexts.push({
        x: px,
        y: py,
        startTime: Date.now(),
        duration: 800,
      });
      asteroidScore += 1;
      self.postMessage({ type: 'playPop' });
      scheduleSpawn();
      return true;
    }
  }
  return false;
}

function loop() {
  if (!ctx || canvasWidth <= 0 || canvasHeight <= 0) return;
  const now = performance.now();
  const deltaMs = lastTime ? now - lastTime : 16;
  lastTime = now;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i < asteroids.length; i++) {
    const a = asteroids[i];
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const s = a.shape;
    ctx.moveTo(s[0].x * a.radius, s[0].y * a.radius);
    for (let j = 1; j < s.length; j++) {
      ctx.lineTo(s[j].x * a.radius, s[j].y * a.radius);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const alpha = p.life / p.maxLife;
    ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const nowMs = Date.now();
  for (let i = 0; i < floatTexts.length; i++) {
    const f = floatTexts[i];
    const elapsed = nowMs - f.startTime;
    if (elapsed >= f.duration) continue;
    const t = elapsed / f.duration;
    const yOffset = t * 40;
    const opacity = 1 - t;
    ctx.fillStyle = 'rgba(255,255,255,' + opacity + ')';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('+1', f.x, f.y - yOffset);
  }
  ctx.textAlign = 'left';

  asteroids = asteroids.filter(function (a) {
    a.x += a.vx * deltaMs;
    a.y += a.vy * deltaMs;
    const inBounds =
      a.x + a.radius > -OFF_SCREEN_MARGIN &&
      a.x - a.radius < canvasWidth + OFF_SCREEN_MARGIN &&
      a.y + a.radius > -OFF_SCREEN_MARGIN &&
      a.y - a.radius < canvasHeight + OFF_SCREEN_MARGIN;
    if (!inBounds && !spawnScheduled) {
      scheduleSpawn();
    }
    return inBounds;
  });

  particles = particles.filter(function (p) {
    p.x += p.vx * deltaMs;
    p.y += p.vy * deltaMs;
    p.life -= deltaMs;
    return p.life > 0;
  });

  floatTexts = floatTexts.filter(function (f) {
    return nowMs - f.startTime < f.duration;
  });
}

self.onmessage = function (e) {
  const data = e.data;
  switch (data.type) {
    case 'init': {
      const offscreen = data.offscreenCanvas;
      if (!offscreen) return;
      offscreenCanvas = offscreen;
      ctx = offscreen.getContext('2d');
      canvasWidth = data.width || 800;
      canvasHeight = data.height || 600;
      offscreen.width = canvasWidth;
      offscreen.height = canvasHeight;
      lastTime = performance.now();
      if (loopIntervalId) clearInterval(loopIntervalId);
      loopIntervalId = self.setInterval(loop, 16);
      scheduleSpawn();
      break;
    }
    case 'resize': {
      canvasWidth = data.width || 800;
      canvasHeight = data.height || 600;
      if (offscreenCanvas) {
        offscreenCanvas.width = canvasWidth;
        offscreenCanvas.height = canvasHeight;
      }
      break;
    }
    case 'click': {
      tryExplodeAt(data.px, data.py);
      break;
    }
    case 'forceSpawn': {
      spawnOne(true);
      break;
    }
    case 'getScore': {
      self.postMessage({ type: 'score', value: asteroidScore });
      break;
    }
    default:
      break;
  }
};
