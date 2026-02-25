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
  const [uploading, setUploading] = useState<"navbar" | "footer" | null>(null);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    target: "navbar" | "footer"
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
        } else {
          setSettings((s) => ({ ...s, footerLogoUrl: data.url }));
        }
      } else {
        setMessage("Error al subir imagen");
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
