import { readMarketing } from "@/lib/marketing";
import {
  renderMarketing,
  marketingRoutes,
  type Locale,
  type MarketingPage,
} from "@/lib/marketing-render";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(_request: Request, context: { params: Promise<{ locale: string; page: string }> }) {
  const params = await context.params;
  const locale = params.locale as Locale;
  const page = params.page as MarketingPage;
  if (
    !Object.hasOwn(marketingRoutes, locale) ||
    !Object.hasOwn(marketingRoutes[locale], page)
  )
    return new Response("Not found", { status: 404 });
  try {
    const state = await readMarketing();
    return new Response(await renderMarketing(state.published, locale, page), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    // Do not show old content as though a published update had succeeded.
    return new Response(
      "Sitio temporalmente no disponible. Intenta nuevamente.",
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
}
