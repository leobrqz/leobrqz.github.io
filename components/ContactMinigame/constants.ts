export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 480;
export const PADDING = 28;

export const SHIP_SPRITE_SHEET_URL = '/assets/spaceship/tinyShip6.png';
export const SHIP_FRAME_WIDTH = 40;
export const SHIP_FRAME_HEIGHT = 22;
export const SHIP_FRAME_PADDING = 1;
export const SHIP_IDLE_FRAME_COUNT = 4;
export const SHIP_IDLE_FRAME_MS = 120;
export const SHIP_HALF_SIZE = SHIP_FRAME_WIDTH / 2;
export const SHIP_ROTATION_OFFSET = Math.PI / 2;
export const SHIP_SPEED = 280;

export const BULLET_WIDTH = 8;
export const BULLET_HEIGHT = 4;
export const BULLET_CORNER_RADIUS = 2;
export const BULLET_SPEED = 520;
export const BULLET_COOLDOWN_MS = 180;

export const ASTEROID_RADIUS_MIN = 12;
export const ASTEROID_RADIUS_MAX = 20;
export const ASTEROID_BASE_SPEED = 120;
export const ASTEROID_SPAWN_INTERVAL_MS_MIN = 900;
export const ASTEROID_SPAWN_INTERVAL_MS_MAX = 1600;
export const ASTEROID_SPAWN_MARGIN = 30;

export const SPEED_SCALE_PER_POINT = 0.002;

export const LIVES_MAX = 3;

export const CONTACT_MINIGAME_BEST_SCORE_KEY = 'contact-minigame:bestScore';

export const SHOOT_SOUND = '/sounds/mixkit-short-laser-gun-shot-1670.wav';
export const HIT_SOUND = '/sounds/mixkit-system-break-2942.wav';

export function getBestScore(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(CONTACT_MINIGAME_BEST_SCORE_KEY);
    if (raw == null) return 0;
    return Math.max(0, parseInt(raw, 10));
  } catch {
    return 0;
  }
}

export function setBestScore(score: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONTACT_MINIGAME_BEST_SCORE_KEY, String(Math.max(0, score)));
  } catch {
    // ignore
  }
}

export function speedMultiplier(score: number): number {
  return 1 + score * SPEED_SCALE_PER_POINT;
}
