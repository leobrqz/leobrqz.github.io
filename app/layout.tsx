import '@mantine/core/styles.css';
import 'github-markdown-css/github-markdown-dark.css';
import '@fontsource-variable/space-grotesk';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/600.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';

import '@/components/Design/global.css';

import { JsonLd } from '@/components/JsonLd';
import { GOOGLE_ANALYTICS_ID, SITE_TITLE, SITE_URL } from '@/config/site';
import { theme } from '@/theme';

const DEFAULT_DESCRIPTION = 'Portfolio and resume of Leonardo Briquezi.';

export const metadata = {
  title: { default: SITE_TITLE, template: SITE_TITLE },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: SITE_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // SiteShell synchronizes lang from the static locale route after mount.
  return (
    <html lang="pt" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.lang = location.pathname.startsWith('/en') ? 'en' : 'pt';",
          }}
        />
        <link rel="icon" type="image/x-icon" href="/assets/favicons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        {/* Google Analytics — plain script tags required for static export */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS_ID}');
            `,
          }}
        />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {children}
        </MantineProvider>
        <JsonLd />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
