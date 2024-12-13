const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
  redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true
      },
      {
        source: '/cs',
        destination: '/dashboard',
        permanent: true
      },
      {
        source: '/sk',
        destination: '/sk/dashboard',
        permanent: true
      }
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  output: 'standalone',
  experimental: {
    instrumentationHook: true
  },
  staticPageGenerationTimeout: 1000,
});

module.exports = nextConfig;
