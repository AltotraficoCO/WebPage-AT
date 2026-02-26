"use client";

import { useState } from "react";
import type { SiteSettings } from "@/types/admin";

interface Props {
  initialSettings: SiteSettings;
}

export default function ChatManager({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage("Guardado correctamente");
      } else {
        setMessage("Error al guardar");
      }
    } catch {
      setMessage("Error al guardar");
    }
    setSaving(false);
  }

  async function handleTest() {
    if (!settings.chatApiUrl || !settings.chatApiKey) {
      setTestResult("Configura la URL y API Key primero");
      return;
    }
    setTesting(true);
    setTestResult("");
    try {
      const res = await fetch(settings.chatApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webchat-key": settings.chatApiKey,
        },
        body: JSON.stringify({ action: "start_session", content: "test" }),
      });
      const data = await res.json();
      if (data.sessionId) {
        setTestResult("Conexión exitosa");
      } else {
        setTestResult(data.error || "Error: no se recibió sessionId");
      }
    } catch {
      setTestResult("Error al conectar con la API");
    }
    setTesting(false);
  }

  return (
    <div className="space-y-8">
      {/* Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Chat flotante</h3>
            <p className="text-sm text-gray-500 mt-1">
              Activa o desactiva el chat en el sitio público
            </p>
          </div>
          <button
            onClick={() =>
              setSettings((s) => ({ ...s, chatEnabled: !s.chatEnabled }))
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.chatEnabled ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                settings.chatEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Config */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Configuración de la API
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              URL de la API
            </label>
            <input
              type="url"
              value={settings.chatApiUrl || ""}
              onChange={(e) =>
                setSettings((s) => ({ ...s, chatApiUrl: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
              placeholder="https://varylo.vercel.app/api/webchat"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={settings.chatApiKey || ""}
              onChange={(e) =>
                setSettings((s) => ({ ...s, chatApiKey: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
              placeholder="wc_xxxxxxxxxxxx"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleTest}
              disabled={testing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors disabled:opacity-50"
            >
              <span
                className={`material-icons text-sm ${testing ? "animate-spin" : ""}`}
              >
                {testing ? "sync" : "wifi_tethering"}
              </span>
              {testing ? "Probando..." : "Probar conexión"}
            </button>
            {testResult && (
              <span
                className={`text-xs ${
                  testResult.includes("exitosa")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {testResult}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Personalization */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Personalización</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Nombre del bot
            </label>
            <input
              type="text"
              value={settings.chatBotName || ""}
              onChange={(e) =>
                setSettings((s) => ({ ...s, chatBotName: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="AT Assistant"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Mensaje de bienvenida
            </label>
            <textarea
              value={settings.chatWelcomeMessage || ""}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  chatWelcomeMessage: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Hola. Soy el asistente de Alto Tráfico. ¿En qué puedo ayudarte?"
            />
            <p className="text-xs text-gray-400 mt-1">
              Se muestra cuando el usuario abre el chat por primera vez
            </p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
        {message && (
          <span
            className={`text-sm ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
