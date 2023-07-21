'use client';

import Error from 'next/error';
// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFoundPage() {
    return (
        <Error statusCode={404} />
    );
}