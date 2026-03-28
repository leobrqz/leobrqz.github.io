import { useCallback, useEffect, useState } from 'react';
import { GITHUB_USERNAME, REPOSITORIES } from '@/config/site';
import { projects_meta, type ProjectLabel } from '@/data/projects_meta';
import {
  fetchLanguages,
  fetchReadmeHtml,
  fetchRepos,
  type GhLanguages,
  type GhRepo,
} from './github-api';

export interface LanguageBreakdownItem {
  name: string;
}

export interface EnrichedProject {
  name: string;
  html_url: string;
  description: string | null;
  updated_at: string;
  language: string | null;
  languages: string[];
  languageBreakdown: LanguageBreakdownItem[];
  libraries: string[];
  tools: string[];
  labels: ProjectLabel[];
}

export type ProjectsState =
  | { status: 'loading' }
  | { status: 'empty'; kind: 'no_config' | 'no_repos' }
  | { status: 'error'; kind: 'rate_limit' | 'generic'; message: string }
  | { status: 'success'; projects: EnrichedProject[] };

const LANGUAGE_SHARE_MIN_PERCENT = 0.3;

function toLanguageBreakdown(langMap: GhLanguages): LanguageBreakdownItem[] {
  const total = Object.values(langMap).reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  return Object.entries(langMap)
    .map(([name, bytes]) => ({ name, bytes, sharePercent: (bytes / total) * 100 }))
    .filter((item) => item.sharePercent >= LANGUAGE_SHARE_MIN_PERCENT)
    .sort((a, b) => b.bytes - a.bytes)
    .map(({ name }) => ({ name }));
}

function mergeMeta(repo: GhRepo, langMap: GhLanguages): EnrichedProject {
  const meta = projects_meta[repo.name];
  const libraries = meta?.libraries ?? [];
  const tools = meta?.tools ?? [];
  const labels = meta?.labels ?? [];
  const languageBreakdown = toLanguageBreakdown(langMap);
  const languages = languageBreakdown.map((item) => item.name);
  return {
    name: repo.name,
    html_url: repo.html_url,
    description: repo.description,
    updated_at: repo.updated_at,
    language: repo.language,
    languages,
    languageBreakdown,
    libraries,
    tools,
    labels,
  };
}

export function useProjects(): {
  state: ProjectsState;
  refetch: () => void;
  fetchReadme: (repoName: string) => Promise<string | null>;
} {
  const [state, setState] = useState<ProjectsState>({ status: 'loading' });

  const load = useCallback(async () => {
    if (REPOSITORIES.length === 0) {
      setState({ status: 'empty', kind: 'no_config' });
      return;
    }
    setState({ status: 'loading' });
    try {
      const repos = await fetchRepos();
      if (repos.length === 0) {
        setState({ status: 'empty', kind: 'no_repos' });
        return;
      }
      const withLangs = await Promise.all(
        repos.map(async (repo) => {
          const langMap = await fetchLanguages(GITHUB_USERNAME, repo.name);
          return mergeMeta(repo, langMap);
        })
      );
      setState({ status: 'success', projects: withLangs });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const kind = message === 'GITHUB_RATE_LIMIT' ? 'rate_limit' : 'generic';
      setState({ status: 'error', kind, message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const fetchReadme = useCallback(async (repoName: string): Promise<string | null> => {
    return fetchReadmeHtml(GITHUB_USERNAME, repoName);
  }, []);

  return {
    state,
    refetch: load,
    fetchReadme,
  };
}
