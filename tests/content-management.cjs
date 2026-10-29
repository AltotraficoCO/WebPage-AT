const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const cache = new Map();
const redis = {
  async get(key) {
    return cache.get(key) ?? null;
  },
  async set(key, value, opts) {
    if (opts?.nx && cache.has(key)) return null;
    cache.set(key, structuredClone(value));
    return "OK";
  },
  async eval(script, keys, args) {
    if (script.includes("cjson.decode")) {
      if ((cache.get(keys[0])?.version ?? 0) !== args[0]) return 0;
      cache.set(keys[0], JSON.parse(args[1]));
      return 1;
    }
    if (cache.get(keys[0]) === args[0]) cache.delete(keys[0]);
    return 1;
  },
};
const resolve = Module._resolveFilename;
Module._resolveFilename = function (id, parent, ...args) {
  return resolve.call(
    this,
    id.startsWith("@/") ? path.resolve("src", id.slice(2)) : id,
    parent,
    ...args,
  );
};
const load = Module._load;
Module._load = function (id, ...args) {
  if (id === "@/lib/redis") return { getRedis: () => redis };
  return load.call(this, id, ...args);
};
require.extensions[".ts"] = (mod, filename) =>
  mod._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
(async () => {
  const { isSameOrigin } = require('../src/lib/request-origin.ts');
  assert.equal(isSameOrigin(new Request('http://localhost/api', {headers:{origin:'https://www.altotrafico.co',host:'www.altotrafico.co'}})),true);
  assert.equal(isSameOrigin(new Request('http://localhost/api', {headers:{origin:'https://attacker.example',host:'www.altotrafico.co'}})),false);
  assert.equal(isSameOrigin(new Request('http://localhost/api')),false);
  const {
    marketingDefaults,
    validateMarketing,
    readMarketing,
    saveMarketing,
  } = require("../src/lib/marketing.ts");
  const {
    renderMarketing,
    marketingRoutes,
  } = require("../src/lib/marketing-render.ts");
  const draft = structuredClone(marketingDefaults);
  draft.es.headline = "Nueva portada <span>con dirección</span>";
  draft.en.services.ai.title = "AI operations revised";
  draft.es.services.tech.imageUrl = "https://example.com/image.jpg";
  draft.es.services.tech.imageAlt = "Software empresarial";
  assert.throws(() =>
    validateMarketing({
      ...draft,
      es: { ...draft.es, lead: "<img src=x onerror=alert(1)>" },
    }),
  );
  assert.throws(() =>
    validateMarketing({
      ...draft,
      es: { ...draft.es, imageUrl: "javascript:alert(1)" },
    }),
  );
  assert.throws(() =>
    validateMarketing({ ...draft, es: { ...draft.es, steps: [] } }),
  );
  await saveMarketing(draft, 0, "draft");
  assert.equal(
    (await readMarketing()).published.es.headline,
    marketingDefaults.es.headline,
  );
  const preview = await renderMarketing(
    (await readMarketing()).draft,
    "en",
    "ai",
    true,
  );
  assert.match(preview, /AI operations revised/);
  assert.match(preview, /noindex,nofollow/);
  assert.match(preview, /__MARKETING_ROUTE__="\/en\/ai-automation\/"/);
  await assert.rejects(saveMarketing(draft, 0, "publish"), /CONFLICT/);
  await saveMarketing(draft, 1, "publish");
  assert.equal(
    (await readMarketing()).published.es.headline,
    draft.es.headline,
  );
  for (const [locale, pages] of Object.entries(marketingRoutes))
    for (const page of Object.keys(pages)) {
      const html = await renderMarketing(
        (await readMarketing()).published,
        locale,
        page,
      );
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
      assert.match(html, /hreflang="es"/);
      assert.match(html, /<html lang=/);
      assert.doesNotMatch(html, /noindex,nofollow/);
      JSON.parse(
        html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
      );
      if (locale === "es" && page === "tech")
        assert.match(html, /alt="Software empresarial"/);
    }
  await saveMarketing(null, 2, "restore");
  assert.equal(
    (await readMarketing()).published.es.headline,
    marketingDefaults.es.headline,
  );
  const {
    importHubSpotBlog,
    readBlogArchive,
    readArchivedPost,
    cleanBlogHtml,
  } = require("../src/lib/blog-archive.ts");
  assert.doesNotMatch(
    cleanBlogHtml(
      '<img src="https://example.com/a.png" onerror=alert(1)><script>alert(1)</script><a href="javascript:alert(1)">X</a>',
    ),
    /onerror|script|javascript/,
  );
  cache.set("site:hubspot-config", { accessToken: "test-only" });
  let calls = 0;
  global.fetch = async (url) => {
    calls++;
    const second = new URL(url).searchParams.get("after") === "second-page";
    return {
      ok: true,
      json: async () => ({
        results: [
          {
            id: second ? "2" : "1",
            state: "PUBLISHED",
            slug: second ? "blog/articulo-dos" : "blog/articulo-uno",
            name: second ? "Dos" : "Uno",
            postBody: "<p>Contenido propio</p><script>evil()</script>",
            featuredImage: "https://example.com/image.jpg",
            publishDate: "2024-01-01T00:00:00Z",
          },
        ],
        total: 2,
        ...(second ? {} : { paging: { next: { after: "second-page" } } }),
      }),
    };
  };
  assert.equal((await importHubSpotBlog()).total, 2);
  assert.equal(calls, 2);
  const saved = await readBlogArchive();
  assert.equal(
    (await readArchivedPost("articulo-dos")).postBody,
    "<p>Contenido propio</p>",
  );
  global.fetch = async () => ({ ok: false, status: 503 });
  await assert.rejects(importHubSpotBlog(), /503/);
  assert.deepEqual(await readBlogArchive(), saved);
  const {
    fetchBlogPosts,
    fetchBlogPostBySlug,
  } = require("../src/lib/hubspot.ts");
  assert.equal((await fetchBlogPosts()).total, 2);
  assert.equal((await fetchBlogPostBySlug("articulo-dos")).name, "Dos");
  assert.equal(await fetchBlogPostBySlug("missing"), null);
  console.log(
    "PASS: draft isolation, publish, restore, conflict protection, ES/EN SSR/metadata/images, input validation, HTML sanitation, complete pagination, atomic import and HubSpot outage independence.",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
