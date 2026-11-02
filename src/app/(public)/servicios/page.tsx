import type { Metadata } from "next";
import ServicesHero from "@/components/servicios/ServicesHero";
import ServiceRows from "@/components/servicios/ServiceRows";
import { conSeo } from "@/lib/atos-seo";
import { AtosFaq } from "@/components/AtosFaq";

export const metadata: Metadata = conSeo("/servicios", {
  title: "Servicios",
  description: "Nuestros servicios de consultoría estratégica de IA.",
});

export default function ServiciosPage() {
  return (
    <>
      <AtosFaq ruta="/servicios" />
      <ServicesHero />
      <ServiceRows />
    </>
  );
}
