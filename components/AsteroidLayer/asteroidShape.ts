/**
 * Generates irregular polygon vertices for an asteroid shape (center 0,0).
 * Used for drawing outline only; scale and translate at draw time.
 */
export interface AsteroidVertex {
  x: number;
  y: number;
}

const VERTEX_COUNT = 10;
const RADIUS_MIN = 0.7;
const RADIUS_RANGE = 0.6;
const ANGLE_JITTER = 0.12;

export function generateAsteroidShape(): AsteroidVertex[] {
  const vertices: AsteroidVertex[] = [];
  for (let i = 0; i < VERTEX_COUNT; i++) {
    const angle =
      (i * (2 * Math.PI)) / VERTEX_COUNT + (Math.random() - 0.5) * ANGLE_JITTER;
    const r = RADIUS_MIN + Math.random() * RADIUS_RANGE;
    vertices.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }
  return vertices;
}
