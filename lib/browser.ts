export type BrowserFamily = 'firefox' | 'chrome' | 'other';

export function detectBrowserFamily(userAgent: string, platform = ''): BrowserFamily {
  const ua = userAgent.toLowerCase();
  const devicePlatform = platform.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua) || devicePlatform.includes('iphone');

  if (isIos && /fxios/.test(ua)) {
    return 'other';
  }
  if (/firefox\//.test(ua)) {
    return 'firefox';
  }
  if (/edg(e|a|ios)?\/|opr\//.test(ua)) {
    return 'other';
  }
  if (/chrome\/|chromium\/|crios\//.test(ua)) {
    return 'chrome';
  }
  return 'other';
}
