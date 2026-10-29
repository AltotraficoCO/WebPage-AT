import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { type MarketingContent } from "@/lib/marketing";

export const marketingRoutes = {
  es: {
    home: "/",
    growth: "/growth-operations/",
    ai: "/automatizacion-ia/",
    tech: "/desarrollo-software/",
    contact: "/contacto/",
  },
  en: {
    home: "/en/",
    growth: "/en/growth-operations/",
    ai: "/en/ai-automation/",
    tech: "/en/software-development/",
    contact: "/en/contact/",
  },
};
export type Locale = keyof typeof marketingRoutes;
export type MarketingPage = keyof typeof marketingRoutes.es;
const escape = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
function safeContent(value: unknown, key = ""): unknown {
  if (typeof value === "string") {
    const escaped = escape(value);
    return key === "imageUrl" || key === "imageAlt"
      ? escaped
      : escaped
          .replace(/&lt;br\s*\/?\s*&gt;/gi, "<br>")
          .replace(/&lt;(\/?span)\s*&gt;/gi, "<$1>")
          .replaceAll("\n", "<br>");
  }
  if (Array.isArray(value)) return value.map((v) => safeContent(v, key));
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([k, v]) => [
      k,
      safeContent(v, k),
    ]),
  );
}
let sourcePromise: Promise<string> | undefined;
export async function renderMarketing(
  content: MarketingContent,
  locale: Locale,
  page: MarketingPage,
  preview = false,
) {
  const route = marketingRoutes[locale][page];
  const root = path.join(process.cwd(), "public/site");
  sourcePromise ??= readFile(path.join(root, "app.js"), "utf8");
  const [source, template] = await Promise.all([
    sourcePromise,
    readFile(path.join(root, route, "index.html"), "utf8"),
  ]);
  const safe = safeContent(content);
  const app = {
    innerHTML: "",
    appendChild(e: {
      className: string;
      href: string;
      aria: string;
      innerHTML: string;
    }) {
      this.innerHTML += `<a class="${e.className}" href="${escape(e.href)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(e.aria)}">${e.innerHTML}</a>`;
    },
  };
  const stub = { addEventListener() {}, focus() {}, setAttribute() {} };
  const document = {
    documentElement: {},
    getElementById(id: string) {
      return id === "app" ? app : null;
    },
    querySelector() {
      return { ...stub };
    },
    createElement() {
      return {
        aria: "",
        setAttribute(k: string, v: string) {
          if (k === "aria-label") this.aria = v;
        },
      };
    },
  };
  // Only our version-controlled renderer is executed. Content is a data object in the context.
  vm.runInNewContext(
    source,
    {
      document,
      location: { pathname: route, hash: "" },
      window: { __MARKETING__: safe, addEventListener() {} },
      cancelAnimationFrame() {},
      setTimeout() {},
      clearTimeout() {},
      encodeURIComponent,
      innerWidth: 1280,
    },
    { timeout: 500 },
  );
  const t = content[locale];
  const service =
    page !== "home" && page !== "contact" ? t.services[page] : null;
  const title =
    service?.seoTitle ||
    (page === "home"
      ? t.seoTitle
      : locale === "es"
        ? "Contacto | Altotráfico"
        : "Contact | Altotráfico");
  const description = (
    service?.lead || (page === "home" ? t.lead : t.contactLead)
  ).replace(/<[^>]*>/g, "");
  const json = JSON.stringify(safe)
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
  let html = template
    .replace(
      /<div id="app">[\s\S]*<\/div><\/body>/,
      () => `<div id="app">${app.innerHTML}</div></body>`,
    )
    .replace(/<title>.*?<\/title>/, () => `<title>${escape(title)}</title>`)
    .replace(
      /(<meta (?:name="description"|property="og:description") content=")[^"]*/g,
      (_, prefix) => `${prefix}${escape(description)}`,
    )
    .replace(
      /(<meta property="og:title" content=")[^"]*/,
      (_, prefix) => `${prefix}${escape(title)}`,
    )
    .replace(
      '<script src="/site/app.js" defer></script>',
      () =>
        `<script>window.__MARKETING__=${json};window.__MARKETING_ROUTE__=${JSON.stringify(route)};</script><script src="/site/app.js" defer></script>`,
    );
  html = html.replace(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    (_, raw) => {
      const schema = JSON.parse(raw);
      for (const entity of schema["@graph"]) {
        if (["WebPage", "ContactPage", "Service"].includes(entity["@type"])) {
          entity.description = description;
          entity.name = entity["@type"] === "Service" ? service?.name : title;
        }
      }
      return `<script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`;
    },
  );
  if (preview)
    html = html
      .replace('content="index,follow"', 'content="noindex,nofollow"')
      .replace(
        "<body>",
        '<body><div style="position:fixed;bottom:8px;left:8px;z-index:9999;background:#163336;color:white;padding:12px">Vista previa del borrador · No publicado</div>',
      );
  return html;
}
