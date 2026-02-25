import type { Metadata } from "next";
import ServicesHero from "@/components/servicios/ServicesHero";
import ServiceRows from "@/components/servicios/ServiceRows";

export const metadata: Metadata = {
  title: "Alto Tráfico - Servicios",
  description: "Nuestros servicios de consultoría estratégica de IA.",
};

export default function ServiciosPage() {
  return (
    <>
      <ServicesHero />
      <ServiceRows />
    </>
  );
}
