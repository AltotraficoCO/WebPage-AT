import type { Metadata } from "next";
import CalculadoraFlow from "@/components/calculadora/CalculadoraFlow";
import { getIndustria, INDUSTRIA_UNIVERSAL } from "@/data/calculadora";
import { conSeo } from "@/lib/atos-seo";
import { AtosFaq } from "@/components/AtosFaq";

const config = getIndustria(INDUSTRIA_UNIVERSAL)!;

export const metadata: Metadata = conSeo("/calculadora", {
  title: config.meta.title,
  description: config.meta.description,
  alternates: { canonical: "/calculadora" },
});

export default function CalculadoraPage() {
  return (
    <>
      <AtosFaq ruta="/calculadora" />
      <CalculadoraFlow config={config} />
    </>
  );
}
