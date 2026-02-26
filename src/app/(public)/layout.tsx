import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiBot from "@/components/AiBot";
import { readSettings, readFooterLinks } from "@/lib/storage";

export const dynamic = "force-dynamic";

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
        contactLocation={settings.contactLocation || "Madrid, España"}
        socialLinks={settings.socialLinks || []}
      />
      <AiBot />
    </>
  );
}
