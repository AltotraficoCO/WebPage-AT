import { auth } from "@/auth";
import { readMarketing } from "@/lib/marketing";
import {
  renderMarketing,
  marketingRoutes,
  type Locale,
  type MarketingPage,
} from "@/lib/marketing-render";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!(await auth())) return new Response("No autorizado", { status: 401 });
  const params = new URL(request.url).searchParams;
  const locale = params.get("locale") as Locale;
  const page = params.get("page") as MarketingPage;
  if (
    !Object.hasOwn(marketingRoutes, locale) ||
    !Object.hasOwn(marketingRoutes[locale], page)
  )
    return new Response("Not found", { status: 404 });
  return new Response(
    await renderMarketing((await readMarketing()).draft, locale, page, true),
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
