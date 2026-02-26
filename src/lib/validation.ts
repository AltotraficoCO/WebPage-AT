import type { SiteSettings, FooterLinksData, CasesData } from "@/types/admin";

const MAX_STRING = 2000;
const MAX_URL = 2048;

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function sanitizeString(s: string, max = MAX_STRING): string {
  return s.slice(0, max).replace(/<[^>]*>/g, "");
}

function sanitizeUrl(s: string): string {
  const trimmed = s.slice(0, MAX_URL).trim();
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed === "#"
  ) {
    return trimmed;
  }
  return "#";
}

export function validateSettings(data: unknown): SiteSettings | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  if (!isString(d.logoUrl) || !isString(d.logoAlt)) return null;
  if (!isString(d.footerLogoUrl)) return null;
  if (!isNumber(d.logoWidth) || !isNumber(d.logoHeight)) return null;
  if (!isNumber(d.footerLogoWidth) || !isNumber(d.footerLogoHeight)) return null;

  return {
    logoUrl: sanitizeUrl(d.logoUrl),
    logoAlt: sanitizeString(d.logoAlt, 200),
    logoWidth: Math.min(Math.max(d.logoWidth, 1), 1000),
    logoHeight: Math.min(Math.max(d.logoHeight, 1), 1000),
    footerLogoUrl: sanitizeUrl(d.footerLogoUrl),
    footerLogoWidth: Math.min(Math.max(d.footerLogoWidth, 1), 1000),
    footerLogoHeight: Math.min(Math.max(d.footerLogoHeight, 1), 1000),
    contactEmail: isString(d.contactEmail) ? sanitizeString(d.contactEmail, 200) : "hola@altotrafico.ai",
    contactLocation: isString(d.contactLocation) ? sanitizeString(d.contactLocation, 200) : "Madrid, España",
    contactLinkedIn: isString(d.contactLinkedIn) ? sanitizeUrl(d.contactLinkedIn) : "#",
    faviconUrl: isString(d.faviconUrl) ? sanitizeUrl(d.faviconUrl) : undefined,
  };
}

export function validateFooterLinks(data: unknown): FooterLinksData | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  if (!Array.isArray(d.legalLinks)) return null;
  if (d.legalLinks.length > 20) return null;

  const legalLinks = d.legalLinks
    .filter(
      (item: unknown) =>
        item &&
        typeof item === "object" &&
        isString((item as Record<string, unknown>).id) &&
        isString((item as Record<string, unknown>).label) &&
        isString((item as Record<string, unknown>).url) &&
        isNumber((item as Record<string, unknown>).order)
    )
    .map((item: unknown) => {
      const i = item as Record<string, unknown>;
      const slug = isString(i.slug) ? i.slug.slice(0, 100).replace(/[^a-z0-9-]/g, "") : undefined;
      const content = isString(i.content) ? i.content.slice(0, 100000) : undefined;
      return {
        id: sanitizeString(i.id as string, 50),
        label: sanitizeString(i.label as string, 100),
        url: slug ? `/legal/${slug}` : sanitizeUrl(i.url as string),
        order: Math.min(Math.max(i.order as number, 0), 100),
        ...(slug && { slug }),
        ...(content && { content }),
      };
    });

  return { legalLinks };
}

export function validateCases(data: unknown): CasesData | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  if (!Array.isArray(d.cases)) return null;
  if (d.cases.length > 50) return null;

  const cases = d.cases
    .filter(
      (item: unknown) =>
        item &&
        typeof item === "object" &&
        isString((item as Record<string, unknown>).id) &&
        isString((item as Record<string, unknown>).title)
    )
    .map((item: unknown) => {
      const i = item as Record<string, unknown>;
      return {
        id: sanitizeString((i.id as string) || "", 50),
        imageUrl: sanitizeUrl((i.imageUrl as string) || ""),
        imageAlt: sanitizeString((i.imageAlt as string) || "", 300),
        tag: sanitizeString((i.tag as string) || "", 50),
        title: sanitizeString((i.title as string) || "", 200),
        description: sanitizeString((i.description as string) || "", 500),
        stat1Label: sanitizeString((i.stat1Label as string) || "", 50),
        stat1Value: sanitizeString((i.stat1Value as string) || "", 50),
        stat2Label: sanitizeString((i.stat2Label as string) || "", 50),
        stat2Value: sanitizeString((i.stat2Value as string) || "", 50),
        order: isNumber(i.order)
          ? Math.min(Math.max(i.order, 0), 100)
          : 0,
      };
    });

  return { cases };
}
