import { SITE_URL } from '@/config/site';

export type PathKey = 'home' | 'projects' | 'resume' | 'contact';

const PATH_KEY_TO_SEGMENT: Record<PathKey, string> = {
  home: '',
  projects: '/projects',
  resume: '/resume',
  contact: '/contact',
};

export function getAlternates(
  locale: 'pt' | 'en',
  pathKey: PathKey
): { canonical: string; languages: { pt: string; en: string } } {
  const path = PATH_KEY_TO_SEGMENT[pathKey];
  const ptUrl = `${SITE_URL}${path || '/'}`;
  const enUrl = `${SITE_URL}/en${path || ''}`;
  const canonical = locale === 'pt' ? ptUrl : enUrl;
  return {
    canonical,
    languages: { pt: ptUrl, en: enUrl },
  };
}
