import type { Metadata } from "next";
import SolicitudContent from "@/components/landing/SolicitudContent";

export const metadata: Metadata = {
  title: "Alto Trafico - Solicitud de Diagnostico",
  description:
    "Solicita tu diagnostico de IA gratuito. Completa el formulario y nuestro equipo te contactara.",
};

export default function SolicitudesPage() {
  return <SolicitudContent />;
}
