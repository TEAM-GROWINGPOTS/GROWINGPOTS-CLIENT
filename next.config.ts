import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://growing-pots.p-e.kr:8081/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
