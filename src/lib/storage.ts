import { getRedis } from "@/lib/redis";
import type {
  SiteSettings,
  FooterLinksData,
  CasesData,
  FooterLink,
  HubSpotConfig,
  AdminUser,
} from "@/types/admin";

const KEYS = {
  settings: "site:settings",
  footerLinks: "site:footer-links",
  cases: "site:cases",
  hubspotConfig: "site:hubspot-config",
  users: "site:users",
} as const;

const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: "/logo.png",
  logoAlt: "Alto Tráfico",
  logoWidth: 160,
  logoHeight: 40,
  footerLogoUrl: "/logo.png",
  footerLogoWidth: 120,
  footerLogoHeight: 32,
};

// ── Settings ────────────────────────────────────────────

export async function readSettings(): Promise<SiteSettings> {
  const redis = getRedis();
  const data = await redis.get<SiteSettings>(KEYS.settings);
  return data ?? DEFAULT_SETTINGS;
}

export async function writeSettings(settings: SiteSettings): Promise<void> {
  const redis = getRedis();
  await redis.set(KEYS.settings, settings);
}

// ── Footer Links ────────────────────────────────────────

export async function readFooterLinks(): Promise<FooterLinksData> {
  const redis = getRedis();
  const data = await redis.get<FooterLinksData>(KEYS.footerLinks);
  return data ?? { legalLinks: [] };
}

export async function writeFooterLinks(data: FooterLinksData): Promise<void> {
  const redis = getRedis();
  await redis.set(KEYS.footerLinks, data);
}

export async function readFooterLinkBySlug(
  slug: string
): Promise<FooterLink | null> {
  const data = await readFooterLinks();
  return data.legalLinks.find((l) => l.slug === slug) || null;
}

// ── Cases ───────────────────────────────────────────────

export async function readCases(): Promise<CasesData> {
  const redis = getRedis();
  const data = await redis.get<CasesData>(KEYS.cases);
  return data ?? { cases: [] };
}

export async function writeCases(data: CasesData): Promise<void> {
  const redis = getRedis();
  await redis.set(KEYS.cases, data);
}

// ── HubSpot Config ──────────────────────────────────────

export async function readHubSpotConfig(): Promise<HubSpotConfig> {
  const redis = getRedis();
  const data = await redis.get<HubSpotConfig>(KEYS.hubspotConfig);
  return data ?? { accessToken: "" };
}

export async function writeHubSpotConfig(
  config: HubSpotConfig
): Promise<void> {
  const redis = getRedis();
  await redis.set(KEYS.hubspotConfig, config);
}

// ── Users ───────────────────────────────────────────────

export async function readUsers(): Promise<AdminUser[]> {
  const redis = getRedis();
  const data = await redis.get<AdminUser[]>(KEYS.users);
  return data ?? [];
}

export async function writeUsers(users: AdminUser[]): Promise<void> {
  const redis = getRedis();
  await redis.set(KEYS.users, users);
}

export async function findUserByUsername(
  username: string
): Promise<AdminUser | null> {
  const users = await readUsers();
  return users.find((u) => u.username === username) || null;
}
