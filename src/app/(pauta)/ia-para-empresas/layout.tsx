import PautaNavbar from "@/components/pauta/PautaNavbar";
import DarkFooter from "@/components/landing/DarkFooter";
import AiBot from "@/components/AiBot";
import { readSettings } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function PautaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await readSettings();

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <PautaNavbar
        logoUrl={settings.logoUrl}
        logoAlt={settings.logoAlt}
        logoWidth={settings.logoWidth}
        logoHeight={settings.logoHeight}
      />
      {children}
      <DarkFooter />
      <AiBot
        enabled={settings.chatEnabled ?? false}
        apiUrl={settings.chatApiUrl || ""}
        apiKey={settings.chatApiKey || ""}
        welcomeMessage={settings.chatWelcomeMessage || "Hola. ¿En qué puedo ayudarte?"}
        botName={settings.chatBotName || "AT Assistant"}
      />
    </div>
  );
}
