import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude problematic packages from server-side bundling
  serverExternalPackages: [
    '@libsql/client',
    '@libsql/hrana-client',
    '@payloadcms/db-sqlite',
    'drizzle-kit',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bbforpeace.org',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'gppac.net',
      },
      {
        protocol: 'https',
        hostname: 'wanep.org',
      },
      {
        protocol: 'https',
        hostname: 'www.macfound.org',
      },
    ],
  },
};

export default nextConfig;
