import { AppThemeProvider } from "@/themes/provider";
import { ErrorWindow } from "@components/ErrorWindow/ErrorWindow.jsx";
import { Footer } from "@components/Footer/Footer.jsx";
import { Header } from "@components/Header/Header.jsx";
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import { Providers } from "@/store/provider";

import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }];
}

export const metadata = {
  title: 'Questy',
  description: 'The place where adventure happen',
}

async function getMessages(locale) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function LocaleLayout({ children, params: { locale } }) {
  const messages = await getMessages(locale);
  return (
    <html lang={locale}>
      {/* It's important to keep a head tag, even if it's empty */}
      <head></head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
              <AppThemeProvider>
                  <div className="App">
                    <Header />
                    {children}
                    <ErrorWindow />
                    <Footer />
                  </div>
              </AppThemeProvider>
            </NextAppDirEmotionCacheProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}