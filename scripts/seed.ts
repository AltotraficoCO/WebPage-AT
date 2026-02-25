/**
 * Seed script: Migrates local JSON data to Upstash Redis
 * and creates the initial admin user.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires .env.local with:
 *   UPSTASH_REDIS_REST_URL=...
 *   UPSTASH_REDIS_REST_TOKEN=...
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync, existsSync } from "fs";
import { Redis } from "@upstash/redis";
import bcrypt from "bcryptjs";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

if (!REDIS_URL || !REDIS_TOKEN) {
  console.error(
    "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in .env.local"
  );
  process.exit(1);
}

const redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
const DATA_DIR = resolve(process.cwd(), "src", "data");

function readJson(filename: string): unknown {
  const filePath = resolve(DATA_DIR, filename);
  if (!existsSync(filePath)) {
    console.log(`  ⚠ ${filename} not found, skipping`);
    return null;
  }
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

async function main() {
  console.log("🚀 Seeding Redis...\n");

  // 1. Settings
  const settings = readJson("settings.json");
  if (settings) {
    await redis.set("site:settings", settings);
    console.log("✓ Settings migrated");
  }

  // 2. Footer links
  const footerLinks = readJson("footer-links.json");
  if (footerLinks) {
    await redis.set("site:footer-links", footerLinks);
    console.log("✓ Footer links migrated");
  }

  // 3. Cases
  const cases = readJson("cases.json");
  if (cases) {
    await redis.set("site:cases", cases);
    console.log("✓ Cases migrated");
  }

  // 4. HubSpot config
  const hubspot = readJson("hubspot-config.json");
  if (hubspot) {
    await redis.set("site:hubspot-config", hubspot);
    console.log("✓ HubSpot config migrated");
  }

  // 5. Create initial admin user
  const existingUsers = await redis.get<unknown[]>("site:users");
  if (existingUsers && existingUsers.length > 0) {
    console.log(`✓ Users already exist (${existingUsers.length}), skipping`);
  } else {
    const password = process.env.SEED_ADMIN_PASSWORD || "admin123";
    const hash = await bcrypt.hash(password, 10);
    const users = [
      {
        id: "1",
        username: process.env.ADMIN_USERNAME || "admin",
        email: "admin@altotrafico.ai",
        passwordHash: hash,
      },
    ];
    await redis.set("site:users", users);
    console.log(
      `✓ Admin user created (username: ${users[0].username}, password: ${password})`
    );
  }

  console.log("\n✅ Seed complete!");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
