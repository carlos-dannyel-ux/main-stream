import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development' ? false : false,
  },
  // Enable static exports for Netlify/Vercel
  // Uncomment if needed: output: 'standalone',
};

export default nextConfig;
