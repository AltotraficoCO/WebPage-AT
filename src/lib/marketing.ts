import defaults from "@/data/marketing.json";
import { getRedis } from "@/lib/redis";

export type MarketingContent = typeof defaults;
export { defaults as marketingDefaults };
export interface MarketingState {
  version: number;
  draft: MarketingContent;
  published: MarketingContent;
  previous?: MarketingContent;
  updatedAt?: string;
  publishedAt?: string;
}
const KEY = "site:marketing:v1";
export async function readMarketing(): Promise<MarketingState> {
  const state = await getRedis()?.get<MarketingState>(KEY);
  return state ?? { version: 0, draft: defaults, published: defaults };
}

// Match the known content schema; never accept executable markup or arbitrary keys.
export function validateMarketing(input: unknown): MarketingContent {
  function visit(value: unknown, template: unknown, key: string): unknown {
    if (typeof template === "string") {
      if (typeof value !== "string" || value.length > 6000)
        throw new Error("Texto inválido: " + key);
      if (key === "imageUrl") {
        if (
          value &&
          !(
            /^\/(?!\/)[a-zA-Z0-9/_.,%+-]+$/.test(value) ||
            /^https:\/\/[^\s<>"'\\]+$/.test(value)
          )
        )
          throw new Error("URL de imagen inválida");
      } else if (
        /<(?!br\s*\/?\s*>|\/?span\s*>)/i.test(value) ||
        /[<>]/.test(value.replace(/<br\s*\/?\s*>|<\/?span\s*>/gi, ""))
      ) {
        throw new Error(
          "Usa texto, saltos de línea y resaltados; no HTML adicional: " + key,
        );
      }
      return value;
    }
    if (Array.isArray(template)) {
      if (!Array.isArray(value) || value.length < 1 || value.length > 30)
        throw new Error("Lista inválida: " + key);
      if (typeof template[0] === "string" && value.length !== template.length)
        throw new Error("Cada elemento requiere título y texto");
      return value.map((v) => visit(v, template[0], key));
    }
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error("Contenido inválido: " + key);
    return Object.fromEntries(
      Object.entries(template as Record<string, unknown>).map(([k, v]) => [
        k,
        visit((value as Record<string, unknown>)[k], v, k),
      ]),
    );
  }
  if (JSON.stringify(input).length > 250000)
    throw new Error("Contenido demasiado extenso");
  return visit(input, defaults, "contenido") as MarketingContent;
}

export async function saveMarketing(
  content: unknown,
  version: number,
  action: "draft" | "publish" | "restore",
) {
  const redis = getRedis();
  if (!redis) throw new Error("El almacenamiento no está configurado");
  const current = await readMarketing();
  if (version !== current.version) throw new Error("CONFLICT");
  const data =
    action === "restore" ? current.previous : validateMarketing(content);
  if (!data) throw new Error("No existe una publicación anterior");
  const next: MarketingState = {
    ...current,
    version: version + 1,
    draft: data,
    updatedAt: new Date().toISOString(),
  };
  if (action !== "draft") {
    next.previous = current.published;
    next.published = data;
    next.publishedAt = next.updatedAt;
  }
  const saved = await redis.eval(
    `local old=redis.call('GET',KEYS[1]); local version=0; if old then version=cjson.decode(old).version end; if version~=tonumber(ARGV[1]) then return 0 end; redis.call('SET',KEYS[1],ARGV[2]); return 1`,
    [KEY],
    [version, JSON.stringify(next)],
  );
  if (!saved) throw new Error("CONFLICT");
  return next;
}
