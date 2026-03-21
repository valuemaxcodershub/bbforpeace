import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  // Disable X-Powered-By header to avoid revealing tech stack
  poweredByHeader: false,
  // Allow larger file uploads (reports, documents)
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
  // Exclude problematic packages from server-side bundling
  serverExternalPackages: [
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
        hostname: 'www.bbforpeace.org',
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
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // Security headers for all routes
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), payment=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ]
  },
};

export default withPayload(nextConfig);
