/** localStorage TTL cache for GitHub API responses. */

const PREFIX = 'gh:';
const DEFAULT_TTL_SECONDS = 3600; // 1 hour

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

function keyWithPrefix(key: string): string {
  return `${PREFIX}${key}`;
}

export function getCached<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(keyWithPrefix(key));
    if (!raw) {
      return null;
    }
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() >= entry.expiresAt) {
      window.localStorage.removeItem(keyWithPrefix(key));
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCached<T>(key: string, data: T, ttlSeconds: number = DEFAULT_TTL_SECONDS): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const entry: CacheEntry<T> = {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    };
    window.localStorage.setItem(keyWithPrefix(key), JSON.stringify(entry));
  } catch {
    // ignore quota / parse errors
  }
}
