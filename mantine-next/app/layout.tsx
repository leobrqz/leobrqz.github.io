import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import { SITE_TITLE, SITE_URL } from '../config/site';

export const metadata = {
  title: { default: SITE_TITLE, template: `%s | ${SITE_TITLE}` },
  description: 'Portfolio and resume of Leonardo Briquez.',
  metadataBase: new URL(SITE_URL),
  openGraph: { url: SITE_URL, siteName: SITE_TITLE },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // html lang kept stable for static export; PT/EN content is identified by route and page metadata
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
