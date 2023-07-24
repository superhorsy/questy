/** @type {import('next').NextConfig} */

const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
    experimental: {appDir: true},
    reactStrictMode: true,
    // ths setting allows next.js to use images from specified domain
    images: {
        domains: [
            process.env.STATIC_DOMAIN,
        ]
    },
})
