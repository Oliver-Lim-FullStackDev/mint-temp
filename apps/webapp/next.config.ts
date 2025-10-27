import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/core/i18n/i18n.ts');

const nextConfig: NextConfig = {
  allowedDevOrigins: ['mint.dev', '*.mint.dev'],
  reactStrictMode: false,
  transpilePackages: ['@mint/mui', '@mint/ui'],
  serverExternalPackages: [],
  trailingSlash: false,
  env: {
    // Add any env vars here
  },
  experimental: {
    // add any flags here
  },
  webpack(currentConfig, { dev, isServer }) {
    let config = currentConfig;

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default withNextIntl(nextConfig);
