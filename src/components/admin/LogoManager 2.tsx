"use client";

import { useState } from "react";
import Image from "next/image";
import type { SiteSettings } from "@/types/admin";

interface Props {
  initialSettings: SiteSettings;
}

export default function LogoManager({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState<"navbar" | "footer" | "favicon" | null>(null);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    target: "navbar" | "footer" | "favicon"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(target);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        if (target === "navbar") {
          setSettings((s) => ({ ...s, logoUrl: data.url }));
        } else if (target === "footer") {
          setSettings((s) => ({ ...s, footerLogoUrl: data.url }));
        } else {
          setSettings((s) => ({ ...s, faviconUrl: data.url }));
        }
      } else {
        setMessage(data.error || "Error al subir imagen");
      }
    } catch {
      setMessage("Error al subir imagen");
    }
    setUploading(null);
  }

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

  return (
    <div className="space-y-8">
      {/* Navbar Logo */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Logo del Navbar</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="w-40 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-2">
            <Image
              src={settings.logoUrl}
              alt={settings.logoAlt}
              width={settings.logoWidth}
              height={settings.logoHeight}
              className="h-8 w-auto object-contain"
            />
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer transition-colors">
            <span className="material-icons text-lg">upload</span>
            {uploading === "navbar" ? "Subiendo..." : "Cambiar imagen"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e, "navbar")}
              disabled={uploading !== null}
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            O pegar URL directa
          </label>
          <input
            type="url"
            value={settings.logoUrl}
            onChange={(e) =>
              setSettings((s) => ({ ...s, logoUrl: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Footer Logo */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Logo del Footer</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="w-32 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-2">
            <Image
              src={settings.footerLogoUrl}
              alt={settings.logoAlt}
              width={settings.footerLogoWidth}
              height={settings.footerLogoHeight}
              className="h-6 w-auto object-contain"
            />
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer transition-colors">
            <span className="material-icons text-lg">upload</span>
            {uploading === "footer" ? "Subiendo..." : "Cambiar imagen"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e, "footer")}
              disabled={uploading !== null}
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            O pegar URL directa
          </label>
          <input
            type="url"
            value={settings.footerLogoUrl}
            onChange={(e) =>
              setSettings((s) => ({ ...s, footerLogoUrl: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Favicon */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Favicon</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          {settings.faviconUrl && (
            <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-1">
              <img
                src={settings.faviconUrl}
                alt="Favicon"
                className="w-8 h-8 object-contain"
              />
            </div>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer transition-colors">
            <span className="material-icons text-lg">upload</span>
            {uploading === "favicon" ? "Subiendo..." : "Cambiar favicon"}
            <input
              type="file"
              accept="image/*,.ico"
              className="hidden"
              onChange={(e) => handleUpload(e, "favicon")}
              disabled={uploading !== null}
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            O pegar URL directa
          </label>
          <input
            type="url"
            value={settings.faviconUrl || ""}
            onChange={(e) =>
              setSettings((s) => ({ ...s, faviconUrl: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="https://... o /favicon.ico"
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Información de Contacto (Footer)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Email
            </label>
            <input
              type="email"
              value={settings.contactEmail || ""}
              onChange={(e) =>
                setSettings((s) => ({ ...s, contactEmail: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="hola@altotrafico.ai"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              value={settings.contactLocation || ""}
              onChange={(e) =>
                setSettings((s) => ({ ...s, contactLocation: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Madrid, España"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Redes Sociales (Footer)</h3>
        <div className="space-y-3">
          {(settings.socialLinks || [])
            .sort((a, b) => a.order - b.order)
            .map((link) => (
            <div key={link.id} className="flex items-center gap-2">
              <select
                value={link.platform}
                onChange={(e) => {
                  const val = e.target.value;
                  setSettings((s) => ({
                    ...s,
                    socialLinks: s.socialLinks.map((l) =>
                      l.id === link.id ? { ...l, platform: val } : l
                    ),
                  }));
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="X">X (Twitter)</option>
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="GitHub">GitHub</option>
              </select>
              <input
                type="url"
                value={link.url}
                onChange={(e) => {
                  const val = e.target.value;
                  setSettings((s) => ({
                    ...s,
                    socialLinks: s.socialLinks.map((l) =>
                      l.id === link.id ? { ...l, url: val } : l
                    ),
                  }));
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="https://..."
              />
              <button
                onClick={() =>
                  setSettings((s) => ({
                    ...s,
                    socialLinks: s.socialLinks.filter((l) => l.id !== link.id),
                  }))
                }
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <span className="material-icons text-lg">delete</span>
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setSettings((s) => ({
              ...s,
              socialLinks: [
                ...(s.socialLinks || []),
                {
                  id: Date.now().toString(),
                  platform: "LinkedIn",
                  url: "",
                  order: (s.socialLinks || []).length + 1,
                },
              ],
            }))
          }
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="material-icons text-lg">add</span>
          Agregar red social
        </button>
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
