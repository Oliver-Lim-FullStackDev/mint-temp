import type { NextConfig } from "next";
import path from 'path';
import { fileURLToPath } from 'url';
import createNextIntlPlugin from 'next-intl/plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin('./src/core/i18n/i18n.ts');

const nextConfig: NextConfig = {
  allowedDevOrigins: ['mint.dev', '*.mint.dev'],
  reactStrictMode: false,
  transpilePackages: ['@mint/ui'],
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
