import type { Metadata } from "next";
import ContactParticleCanvas from "@/components/contacto/ContactParticleCanvas";
import ContactCursor from "@/components/contacto/ContactCursor";
import ContactForm from "@/components/contacto/ContactForm";

export const metadata: Metadata = {
  title: "Alto Tráfico - Contacto",
  description: "Contáctanos para diseñar la estrategia de IA de tu empresa.",
};

export default function ContactoPage() {
  return (
    <>
      <ContactCursor />
      <ContactParticleCanvas />
      <main className="pt-20 min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-white">
        {/* Subtle background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-1/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <ContactForm />
      </main>
    </>
  );
}
