import { createContentlayerPlugin } from 'next-contentlayer2';

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  experimental: {
    turbo: {
      rules: {
        '*.mdx': ['contentlayer/process-mdx'],
      },
    },
  },
  // Server configuration
  serverExternalPackages: ['@prisma/client'],
  reactStrictMode: true,
  // Enable image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.cache = {
      type: 'filesystem',
      compression: 'brotli',
      // Increase cache size
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    };
    return config;
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: true,
  },
  output: 'standalone',
  poweredByHeader: false,
};

const withContentlayer = createContentlayerPlugin({});

export default withContentlayer(nextConfig);
