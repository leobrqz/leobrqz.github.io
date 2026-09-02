'use client';

import { type CSSProperties, useEffect, useRef } from 'react';
import type { Lang } from '@/lib/i18n';
import styles from './SystemsAtlas.module.css';

const ROUTE_A = 'M -50 620 C 150 500 280 710 485 588 S 790 350 1005 464 S 1260 666 1490 465';
const ROUTE_B = 'M -35 238 C 170 350 342 105 560 268 S 890 550 1114 295 S 1360 188 1488 330';

type AtlasStyle = CSSProperties & {
  '--atlas-progress'?: string;
};

type AtlasLayer = {
  label: string;
  title: string;
  description: string;
};

export type SystemsAtlasProps = {
  variant?: 'background' | 'panel';
  lang?: Lang;
  location?: string;
};

function getLayers(lang: Lang): AtlasLayer[] {
  return lang === 'en'
    ? [
      { label: 'context', title: 'Understand', description: 'the real workflow' },
      { label: 'service', title: 'Orchestrate', description: 'the moving parts' },
      { label: 'data', title: 'Keep state', description: 'where it belongs' },
      { label: 'product', title: 'Ship clarity', description: 'to the person using it' },
    ]
    : [
      { label: 'contexto', title: 'Entender', description: 'o fluxo real' },
      { label: 'serviço', title: 'Orquestrar', description: 'as partes móveis' },
      { label: 'dados', title: 'Manter estado', description: 'no lugar certo' },
      { label: 'produto', title: 'Entregar clareza', description: 'para quem usa' },
    ];
}

function AtlasRoutes() {
  return (
    <svg className={styles.backgroundSvg} viewBox="0 0 1440 900" preserveAspectRatio="none">
      <path d={ROUTE_A} className={`${styles.route} ${styles.routePrimary}`} />
      <path d={ROUTE_B} className={`${styles.route} ${styles.routeSecondary}`} />
      <path d="M -20 448 H 1460" className={styles.routeRail} />
      <g className={styles.routeMarkers}>
        <circle cx="214" cy="581" r="3" />
        <circle cx="548" cy="551" r="3" />
        <circle cx="886" cy="421" r="3" />
        <circle cx="1226" cy="573" r="3" />
      </g>
      <circle className={styles.atlasSignal} r="4">
        <animateMotion dur="17s" repeatCount="indefinite" path={ROUTE_A} />
      </circle>
      <circle className={`${styles.atlasSignal} ${styles.atlasSignalWarm}`} r="3">
        <animateMotion dur="23s" begin="-8s" repeatCount="indefinite" path={ROUTE_B} />
      </circle>
    </svg>
  );
}

function BackgroundAtlas() {
  const atlasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      atlasRef.current?.style.setProperty('--atlas-progress', progress.toFixed(3));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div ref={atlasRef} className={styles.background} style={{ '--atlas-progress': '0' } as AtlasStyle} aria-hidden="true">
      <div className={styles.grid} />
      <AtlasRoutes />
    </div>
  );
}

function PanelAtlas({ lang, location }: { lang: Lang; location?: string }) {
  const layers = getLayers(lang);

  return (
    <div
      className={styles.panel}
      role="img"
      aria-label={lang === 'en' ? 'System flow from context to product' : 'Fluxo de sistema do contexto ao produto'}
    >
      <div className={styles.panelHeader}>
        <span>{lang === 'en' ? 'SYSTEMS ATLAS' : 'ATLAS DE SISTEMAS'}</span>
        <span className={styles.liveSignal}><i /> {lang === 'en' ? 'TRACE ACTIVE' : 'TRACE ATIVO'}</span>
      </div>

      <div className={styles.panelMap}>
        <span className={styles.panelRoute} />
        <span className={styles.panelSignal} aria-hidden="true" />
        {layers.map((layer) => (
          <div className={styles.panelNode} key={layer.label}>
            <span className={styles.panelNodeDot} />
            <span className={styles.panelNodeLabel}>{layer.label}</span>
            <div className={styles.panelNodeCopy}>
              <strong>{layer.title}</strong>
              <small>{layer.description}</small>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.panelFooter}>
        <span>{location ?? 'Florianópolis, SC'}</span>
        <span>{lang === 'en' ? 'backend / AI / product' : 'backend / IA / produto'}</span>
      </div>
    </div>
  );
}

export function SystemsAtlas({ variant = 'background', lang = 'pt', location }: SystemsAtlasProps) {
  if (variant === 'panel') {
    return <PanelAtlas lang={lang} location={location} />;
  }

  return <BackgroundAtlas />;
}
