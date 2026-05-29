import type { Metadata } from "next";
import CalculadoraFlow from "@/components/calculadora/CalculadoraFlow";
import { getIndustria, INDUSTRIA_UNIVERSAL } from "@/data/calculadora";

const config = getIndustria(INDUSTRIA_UNIVERSAL)!;

export const metadata: Metadata = {
  title: config.meta.title,
  description: config.meta.description,
  alternates: { canonical: "/calculadora" },
};

export default function CalculadoraPage() {
  return <CalculadoraFlow config={config} />;
}
