type GtagEvent =
  | 'readme_expand'
  | 'resume_download'
  | 'project_label_changelog'
  | 'github_repo'
  | 'github'
  | 'linkedin'
  | 'email';

export function trackEvent(event: GtagEvent, params?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', event, params ?? {});
  }
}
