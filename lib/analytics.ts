type GtagEvent =
  | 'game_start'
  | 'game_over'
  | 'game_restart'
  | 'readme_expand'
  | 'resume_download'
  | 'github_repo'
  | 'github'
  | 'linkedin';

export function trackEvent(event: GtagEvent, params?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', event, params ?? {});
  }
}
