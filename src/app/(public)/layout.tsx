import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar
        logoUrl="/uploads/logo-1772055291022.jpg"
        logoAlt="Alto Tráfico"
        logoWidth={160}
        logoHeight={40}
      />
      {children}
      <Footer
        logoUrl="/uploads/logo-1772055291022.jpg"
        logoAlt="Alto Tráfico"
        logoWidth={120}
        logoHeight={32}
        legalLinks={[
          {
            id: "1",
            label: "Política de Tratamiento de Datos",
            url: "/legal/politica-datos",
            order: 1,
          },
        ]}
        contactEmail="hola@altotrafico.ai"
        contactLocation="Madrid, España"
        socialLinks={[]}
      />
    </>
  );
}
