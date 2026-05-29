import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CalculadoraFlow from "@/components/calculadora/CalculadoraFlow";
import { getIndustria, SLUGS_VARIANTES } from "@/data/calculadora";

interface PageProps {
  params: Promise<{ industria: string }>;
}

// Pre-genera las rutas estáticas de cada variante de industria.
export function generateStaticParams() {
  return SLUGS_VARIANTES.map((industria) => ({ industria }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industria } = await params;
  const config = getIndustria(industria);
  if (!config) return {};
  return {
    title: config.meta.title,
    description: config.meta.description,
    alternates: { canonical: `/calculadora/${industria}` },
  };
}

export default async function CalculadoraVariantePage({ params }: PageProps) {
  const { industria } = await params;
  const config = getIndustria(industria);
  // "universal" vive en /calculadora; acá solo variantes válidas.
  if (!config || !SLUGS_VARIANTES.includes(industria)) notFound();
  return <CalculadoraFlow config={config} />;
}
