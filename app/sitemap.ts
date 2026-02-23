import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

const PT_PATHS = ['', '/projects', '/resume', '/contact'];
const EN_PATHS = ['/en', '/en/projects', '/en/resume', '/en/contact'];

function toUrl(path: string): string {
  const base = path === '' ? '/' : path;
  return `${SITE_URL}${base}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const ptEntries = PT_PATHS.map((path) => ({
    url: toUrl(path),
    lastModified: now,
  }));
  const enEntries = EN_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));
  return [...ptEntries, ...enEntries];
}
