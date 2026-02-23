'use client';

import React, { useEffect, useState } from 'react';

/**
 * Renders children only after mount. Used to avoid hydration mismatch when
 * descendants use React useId() and server/client tree or order differs.
 */
export function ClientOnlyChildren({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
