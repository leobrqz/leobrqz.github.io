'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const GA_ID = 'G-GZ4JSFHDND';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('config', GA_ID, { page_path: pathname });
    }
  }, [pathname]);

  return null;
}
