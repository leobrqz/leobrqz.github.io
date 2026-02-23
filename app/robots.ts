import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
    rules: { allow: '/' },
  };
}
