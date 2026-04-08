import ChatManager from "@/components/admin/ChatManager";
import { readSettings } from "@/lib/storage";

export default async function ChatPage() {
  const settings = await readSettings();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Chat
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Configura el chat flotante que aparece en el sitio web.
        </p>
      </div>
      <ChatManager initialSettings={settings} />
    </div>
  );
}
