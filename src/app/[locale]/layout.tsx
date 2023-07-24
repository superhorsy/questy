import {AppThemeProvider} from "@/themes/provider";
import {ErrorWindow} from "@components/ErrorWindow/ErrorWindow.jsx";
import {Footer} from "@components/Footer/Footer.jsx";
import {NextAppDirEmotionCacheProvider} from "tss-react/next/appDir";
import {Providers} from "@/store/provider";

import {NextIntlClientProvider, useLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import React from "react";

// export function generateStaticParams() {
//     return [{locale: 'en'}, {locale: 'ru'}];
// }

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

export default async function LocaleLayout({children, params}) {
    const locale = useLocale();
    // Show a 404 error if the user requests an unknown locale
    if (params.locale !== locale) {
        notFound();
    }
    const messages = await getMessages(locale);
    return (
        <html lang={locale}>
        <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
                <NextAppDirEmotionCacheProvider options={{key: "css"}}>
                    <AppThemeProvider>
                        <div className="App">
                            {children}
                            <ErrorWindow/>
                            <Footer/>
                        </div>
                    </AppThemeProvider>
                </NextAppDirEmotionCacheProvider>
            </Providers>
        </NextIntlClientProvider>
        </body>
        </html>
    )
}
