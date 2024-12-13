import { NextIntlClientProvider } from 'next-intl';
import { Inter } from 'next/font/google';
import React from 'react';
import Toaster from '../components/toaster';
import deepMerge from 'deepmerge';
import { AbstractIntlMessages } from 'use-intl';
import ConfirmDialog from '../components/confirm/confirmDialog';
import ConfirmProvider from '../components/confirm/confirmProvider';
import '../globals.css';
import { Metadata } from 'next';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext']
});

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    icons: {
      icon: `/favicon_${params.locale}.png`
    }
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  let locale;

  try {
    messages = deepMerge(
      (await import(`../../messages/cs.json`)).default,
      (await import(`../../messages/${params.locale}.json`)).default
    ) as AbstractIntlMessages;
    locale = params.locale;
  } catch (error) {
    messages = (await import('../../messages/cs.json')).default;
    locale = 'cs';
  }

  return (
    <html lang={locale}>
      <body className={inter.variable}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Toaster />
          <ConfirmProvider ConfirmComponent={ConfirmDialog}>{children}</ConfirmProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
