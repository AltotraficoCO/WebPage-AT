import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { readSettings, readFooterLinks } from "@/lib/storage";

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await readSettings();
  const footerLinksData = await readFooterLinks();

  return (
    <>
      <Navbar
        logoUrl={settings.logoUrl}
        logoAlt={settings.logoAlt}
        logoWidth={settings.logoWidth}
        logoHeight={settings.logoHeight}
      />
      {children}
      <Footer
        logoUrl={settings.footerLogoUrl}
        logoAlt={settings.logoAlt}
        logoWidth={settings.footerLogoWidth}
        logoHeight={settings.footerLogoHeight}
        legalLinks={footerLinksData.legalLinks}
        contactEmail={settings.contactEmail || "hola@altotrafico.ai"}
        contactLocation="Hub en Medellín, Colombia"
        socialLinks={settings.socialLinks || []}
      />
      <a href="https://wa.me/573045248141" target="_blank" rel="noopener noreferrer" aria-label="Conversar por WhatsApp" className="fixed bottom-5 right-5 z-50 rounded-full bg-primary text-white px-6 py-3 shadow-lg">WhatsApp ↗</a>
    </>
  );
}
