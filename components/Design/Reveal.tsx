'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Adds a restrained reveal after an element enters view; the server-rendered content stays visible. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSeen(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-reveal={seen ? 'seen' : undefined}
      style={
        seen
          ? { animation: `graphite-reveal 420ms ease-out both`, animationDelay: `${delay}ms` }
          : undefined
      }
    >
      {children}
    </div>
  );
}
