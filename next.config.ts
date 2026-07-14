import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://growing-pots.p-e.kr:8081/api/v1/:path*',
      },
      {
        source: '/landing',
        destination: 'https://growingpots-landing.vercel.app/landing',
      },
      {
        source: '/landing/:path*',
        destination: 'https://growingpots-landing.vercel.app/landing/:path*',
      },
    ];
  },
};

export default nextConfig;
