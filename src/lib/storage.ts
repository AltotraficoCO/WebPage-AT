import { getRedis } from "@/lib/redis";
import type {
  SiteSettings,
  FooterLinksData,
  CasesData,
  FooterLink,
  HubSpotConfig,
  AdminUser,
} from "@/types/admin";

async function readLocalJson<T>(filename: string): Promise<T | null> {
  try {
    // Dynamic require to avoid Edge Runtime static analysis
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs").promises;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    const filePath = path.join(path.resolve("."), "src", "data", filename);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const KEYS = {
  settings: "site:settings",
  footerLinks: "site:footer-links",
  cases: "site:cases",
  hubspotConfig: "site:hubspot-config",
  users: "site:users",
} as const;

const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: "/logo.png",
  logoAlt: "Altotrafico",
  logoWidth: 160,
  logoHeight: 40,
  footerLogoUrl: "/logo.png",
  footerLogoWidth: 120,
  footerLogoHeight: 32,
  contactEmail: "hola@altotrafico.ai",
  contactLocation: "Madrid, España",
  socialLinks: [],
  chatEnabled: true,
  chatApiUrl: "https://varylo.vercel.app/api/webchat",
  chatApiKey: "",
  chatWelcomeMessage: "Hola. Soy el asistente de Altotrafico. ¿En qué puedo ayudarte?",
  chatBotName: "AT Assistant",
};

// ── Settings ────────────────────────────────────────────

export async function readSettings(): Promise<SiteSettings> {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<SiteSettings>(KEYS.settings);
    return data ?? DEFAULT_SETTINGS;
  }
  return (await readLocalJson<SiteSettings>("settings.json")) ?? DEFAULT_SETTINGS;
}

export async function writeSettings(settings: SiteSettings): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error("Redis not configured");
  await redis.set(KEYS.settings, settings);
}

// ── Footer Links ────────────────────────────────────────

export async function readFooterLinks(): Promise<FooterLinksData> {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<FooterLinksData>(KEYS.footerLinks);
    return data ?? { legalLinks: [] };
  }
  return (await readLocalJson<FooterLinksData>("footer-links.json")) ?? { legalLinks: [] };
}

export async function writeFooterLinks(data: FooterLinksData): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error("Redis not configured");
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
  if (redis) {
    const data = await redis.get<CasesData>(KEYS.cases);
    return data ?? { cases: [] };
  }
  return (await readLocalJson<CasesData>("cases.json")) ?? { cases: [] };
}

export async function writeCases(data: CasesData): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error("Redis not configured");
  await redis.set(KEYS.cases, data);
}

// ── HubSpot Config ──────────────────────────────────────

export async function readHubSpotConfig(): Promise<HubSpotConfig> {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<HubSpotConfig>(KEYS.hubspotConfig);
    return data ?? { accessToken: "" };
  }
  return { accessToken: "" };
}

export async function writeHubSpotConfig(
  config: HubSpotConfig
): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error("Redis not configured");
  await redis.set(KEYS.hubspotConfig, config);
}

// ── Users ───────────────────────────────────────────────

export async function readUsers(): Promise<AdminUser[]> {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<AdminUser[]>(KEYS.users);
    return data ?? [];
  }
  return [];
}

export async function writeUsers(users: AdminUser[]): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error("Redis not configured");
  await redis.set(KEYS.users, users);
}

export async function findUserByUsername(
  username: string
): Promise<AdminUser | null> {
  const users = await readUsers();
  return users.find((u) => u.username === username) || null;
}
