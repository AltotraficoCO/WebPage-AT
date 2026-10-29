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
  outputFileTracingIncludes: { "/api/marketing/**": ["./public/site/**/*"], "/api/admin/marketing/preview": ["./public/site/**/*"] },
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    const routes = { es: { home: "/", growth: "/growth-operations", ai: "/automatizacion-ia", tech: "/desarrollo-software", contact: "/contacto" }, en: { home: "/en", growth: "/en/growth-operations", ai: "/en/ai-automation", tech: "/en/software-development", contact: "/en/contact" } };
    const pages = Object.entries(routes).flatMap(([locale, entries]) => Object.entries(entries).map(([page, source]) => ({ source, destination: `/api/marketing/${locale}/${page}` })));
    return { beforeFiles: [{ source: "/sitemap.xml", destination: "/api/site-map" }, ...pages.flatMap(p => p.source === "/" ? [p] : [p, { ...p, source: p.source + "/" }])], afterFiles: [], fallback: [] };
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
