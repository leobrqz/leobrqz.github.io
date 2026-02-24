import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { ClientOnlyChildren } from '@/components/ClientOnlyChildren';
import { JsonLd } from '@/components/JsonLd';
import { SITE_TITLE, SITE_URL } from '@/config/site';
import { theme } from '@/theme';

const DEFAULT_DESCRIPTION = 'Portfolio and resume of Leonardo Briquezi.';

export const metadata = {
  title: { default: SITE_TITLE, template: `%s | ${SITE_TITLE}` },
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
  // html lang kept stable for static export; PT/EN content is identified by route and page metadata
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <link rel="icon" type="image/x-icon" href="/assets/favicons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicons/apple-touch-icon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <ClientOnlyChildren>{children}</ClientOnlyChildren>
        </MantineProvider>
        <JsonLd />
      </body>
    </html>
  );
}
