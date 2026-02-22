'use client';

import { useCallback, useEffect, useState } from 'react';
import { GITHUB_USERNAME, REPOSITORIES } from '@/config/site';
import { projects_meta } from '@/data/projects_meta';
import {
  fetchLanguages,
  fetchReadmeHtml,
  fetchRepos,
  type GhLanguages,
  type GhRepo,
} from './github-api';

export interface EnrichedProject {
  name: string;
  html_url: string;
  description: string | null;
  updated_at: string;
  language: string | null;
  languages: string[];
  libraries: string[];
  tools: string[];
}

export type ProjectsState =
  | { status: 'loading' }
  | { status: 'empty'; kind: 'no_config' | 'no_repos' }
  | { status: 'error'; message: string }
  | { status: 'success'; projects: EnrichedProject[] };

function mergeMeta(repo: GhRepo, langMap: GhLanguages): EnrichedProject {
  const meta = projects_meta[repo.name];
  const libraries = meta?.libraries ?? [];
  const tools = meta?.tools ?? [];
  const languages = Object.keys(langMap);
  return {
    name: repo.name,
    html_url: repo.html_url,
    description: repo.description,
    updated_at: repo.updated_at,
    language: repo.language,
    languages,
    libraries,
    tools,
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
      setState({ status: 'error', message });
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
