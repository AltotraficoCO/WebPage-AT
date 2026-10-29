import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    const pages = [{"source": "/", "destination": "/site/index.html"}, {"source": "/growth-operations", "destination": "/site/growth-operations/index.html"}, {"source": "/automatizacion-ia", "destination": "/site/automatizacion-ia/index.html"}, {"source": "/desarrollo-software", "destination": "/site/desarrollo-software/index.html"}, {"source": "/contacto", "destination": "/site/contacto/index.html"}, {"source": "/en", "destination": "/site/en/index.html"}, {"source": "/en/growth-operations", "destination": "/site/en/growth-operations/index.html"}, {"source": "/en/ai-automation", "destination": "/site/en/ai-automation/index.html"}, {"source": "/en/software-development", "destination": "/site/en/software-development/index.html"}, {"source": "/en/contact", "destination": "/site/en/contact/index.html"}];
    return { beforeFiles: pages.flatMap(p => p.source === "/" ? [p] : [p, { ...p, source: p.source + "/" }]), afterFiles: [], fallback: [] };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.hubspot.com",
      },
      {
        protocol: "https",
        hostname: "**.hsforms.com",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "altotrafico.co",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
