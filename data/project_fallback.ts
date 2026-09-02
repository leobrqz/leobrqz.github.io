import { GITHUB_USERNAME } from '@/config/site';
import { projects_meta } from './projects_meta';
import { resume_projects } from './resume_projects';
import type { EnrichedProject } from '@/lib/use-projects';
import type { Lang } from '@/lib/i18n';

const FALLBACK_NAMES = ['JobAppliesTracker', 'ShScriptHub', 'AutoPot-DR', 'SmokeShopERP-DataAnalytics'];

function getSummary(projectName: string, lang: Lang): string {
  const project = resume_projects.find((item) => item.name.en === projectName);
  if (project) {
    return project.description[lang]
      .split('\n')
      .map((line) => line.replace(/^-\s*/, '').trim())
      .filter(Boolean)[0] ?? '';
  }

  if (projectName === 'TrackLyrics-ytdlp') {
    return lang === 'en'
      ? 'A local desktop app for downloading tracks, organizing lyrics and playing a curated library.'
      : 'Aplicativo desktop local para baixar faixas, organizar letras e tocar uma biblioteca curada.';
  }

  return '';
}

export function getFallbackProjects(lang: Lang): EnrichedProject[] {
  return FALLBACK_NAMES.map((name) => {
    const meta = projects_meta[name];
    const project = resume_projects.find((item) => item.name.en === name);
    const technologies = project?.technologies ?? [];
    const languageBreakdown = technologies.slice(0, 3).map((technology) => ({ name: technology }));

    return {
      name,
      html_url: `https://github.com/${GITHUB_USERNAME}/${name}`,
      description: getSummary(name, lang),
      updated_at: '',
      language: technologies[0] ?? null,
      languages: technologies.slice(0, 3),
      languageBreakdown,
      libraries: meta?.libraries ?? technologies.slice(1, 4),
      tools: meta?.tools ?? [],
      labels: meta?.labels ?? [],
    };
  });
}
