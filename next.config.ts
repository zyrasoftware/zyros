import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  distDir: 'dist',
  experimental: {
    // Better Windows compatibility
    esmExternals: 'loose',
  },
};

export default nextConfig;
