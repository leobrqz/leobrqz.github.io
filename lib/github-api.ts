import { GITHUB_USERNAME, REPOSITORIES } from '@/config/site';
import { getCached, setCached } from './github-cache';

const GITHUB_API = 'https://api.github.com';
const CACHE_TTL = 3600;

export interface GhRepo {
  name: string;
  html_url: string;
  description: string | null;
  updated_at: string;
  language: string | null;
}

export type GhLanguages = Record<string, number>;

/** GET /users/:username/repos?per_page=100, then filter by REPOSITORIES and preserve order. */
export async function fetchRepos(): Promise<GhRepo[]> {
  const cacheKey = `repos:${GITHUB_USERNAME}`;
  const cached = getCached<GhRepo[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const url = `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100`;
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
  });
  if (res.status === 403) {
    throw new Error('GITHUB_RATE_LIMIT');
  }
  if (!res.ok) {
    throw new Error(`GitHub repos: ${res.status}`);
  }
  const data: GhRepo[] = await res.json();
  const ordered = REPOSITORIES.map((name) => data.find((r) => r.name === name)).filter(
    (r): r is GhRepo => r != null
  );
  setCached(cacheKey, ordered, CACHE_TTL);
  return ordered;
}

/** GET /repos/:owner/:repo/languages. */
export async function fetchLanguages(owner: string, repo: string): Promise<GhLanguages> {
  const cacheKey = `languages:${owner}:${repo}`;
  const cached = getCached<GhLanguages>(cacheKey);
  if (cached) {
    return cached;
  }

  const url = `${GITHUB_API}/repos/${owner}/${repo}/languages`;
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
  });
  if (!res.ok) {
    return {};
  }
  const data: GhLanguages = await res.json();
  setCached(cacheKey, data, CACHE_TTL);
  return data;
}

/** Extract default branch from GitHub readme response html_url. */
function defaultBranchFromReadmeResponse(data: { html_url?: string }): string {
  const url = data?.html_url;
  if (typeof url !== 'string') {
    return 'main';
  }
  const match = url.match(/\/blob\/([^/]+)\//);
  return match ? match[1] : 'main';
}

/** Rewrite README HTML image URLs to raw.githubusercontent.com and remove heading anchor links. */
function processReadmeHtml(html: string, owner: string, repo: string, branch: string): string {
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;

  // Blob URLs -> raw URLs
  let out = html.replace(
    /https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/([^"'\s)>]+)/g,
    (_, o, r, b, path) => `https://raw.githubusercontent.com/${o}/${r}/${b}/${path}`
  );

  // Relative img src (e.g. ./img.png or docs/img.png) -> raw URL
  out = out.replace(/(\bsrc=)(["'])(?!https?:|\/\/|data:)([^"']+)\2/gi, (_, attr, quote, path) => {
    const normalized = path.replace(/^\.\//, '').trim();
    if (!normalized) {
      return attr + quote + path + quote;
    }
    return attr + quote + rawBase + normalized + quote;
  });

  // Remove heading anchor elements (chain-link icons): <a class="anchor" ...>...</a>
  out = out.replace(/<a\s+[^>]*class="[^"]*anchor[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');

  return out;
}

/** README as HTML: GET /repos/:owner/:repo/readme with Accept application/vnd.github.html+json. */
export async function fetchReadmeHtml(owner: string, repo: string): Promise<string | null> {
  const cacheKey = `readme:${owner}:${repo}`;
  const cached = getCached<{ html: string | null }>(cacheKey);
  if (cached !== null) {
    return cached.html;
  }

  const url = `${GITHUB_API}/repos/${owner}/${repo}/readme`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.html+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (res.status === 404) {
    setCached(cacheKey, { html: null }, CACHE_TTL);
    return null;
  }
  if (res.status === 403) {
    throw new Error('GITHUB_RATE_LIMIT');
  }
  if (!res.ok) {
    throw new Error(`GitHub readme: ${res.status}`);
  }
  const text = await res.text();
  let html: string | null = null;
  let branch = 'main';

  try {
    const data = JSON.parse(text) as Record<string, unknown>;
    if (data && typeof data === 'object') {
      branch = defaultBranchFromReadmeResponse(data as { html_url?: string });
      if (typeof data.body === 'string' && data.body.length > 0) {
        html = data.body;
      } else if (typeof data.html === 'string' && data.html.length > 0) {
        html = data.html;
      }
    }
  } catch {
    // not JSON
  }
  if (html == null && text.trim().length > 0) {
    const trimmed = text.trim();
    if (trimmed.startsWith('<')) {
      html = text;
    }
  }

  if (html != null && html.length > 0) {
    html = processReadmeHtml(html, owner, repo, branch);
  } else {
    html = null;
  }

  setCached(cacheKey, { html }, CACHE_TTL);
  return html;
}
