/** @type {import('next').NextConfig} */

const withNextIntl = require('next-intl/plugin')(
    // This is the default (also the `src` folder is supported out of the box)
    './i18n.js'
);

const nextConfig = {
    experimental: {appDir: true},
    reactStrictMode: true,
    // ths setting allows next.js to use images from specified domain
    images: {
        domains: [
            process.env.STATIC_DOMAIN,
        ]
    },
    // images: {
    //   remotePatterns: [
    //     {
    //       protocol: 'https',
    //       hostname: '',
    //       port: '',
    //       pathname: '/files/**',
    //     },
    //   ],
    // },
    // async rewrites() {
    //   return [
    //     {
    //       source: '/api/:path*',
    //       destination: process.env.BACKEND_URL + '/api/:path*', // Proxy to Backend
    //     },
    //     {
    //       source: '/files/:path*',
    //       destination: process.env.BACKEND_URL + '/files/:path*', // Proxy to Backend
    //     },
    //   ]
    // },
}

module.exports = withNextIntl(nextConfig)
