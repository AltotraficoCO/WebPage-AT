import { faqJsonLd } from "@/lib/atos-seo";

/** Las preguntas frecuentes que dejó AT OS para la ruta, como schema FAQPage. */
export function AtosFaq({ ruta }: { ruta: string }) {
  const json = faqJsonLd(ruta);
  if (!json) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
