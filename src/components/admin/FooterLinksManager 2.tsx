"use client";

import { useState } from "react";
import type { FooterLink } from "@/types/admin";

interface Props {
  initialLinks: FooterLink[];
}

export default function FooterLinksManager({ initialLinks }: Props) {
  const [links, setLinks] = useState<FooterLink[]>(initialLinks);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  function addLink() {
    const newLink: FooterLink = {
      id: Date.now().toString(),
      label: "",
      url: "",
      order: links.length + 1,
    };
    setLinks([...links, newLink]);
    setEditingId(newLink.id);
  }

  function updateLink(
    id: string,
    field: keyof FooterLink,
    value: string | number
  ) {
    setLinks(
      links.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, [field]: value };
        // Auto-set url when slug changes
        if (field === "slug" && typeof value === "string" && value) {
          updated.url = `/legal/${value}`;
        }
        return updated;
      })
    );
  }

  function toggleContent(id: string) {
    setLinks(
      links.map((l) => {
        if (l.id !== id) return l;
        if (l.slug) {
          // Remove content mode
          const { slug: _s, content: _c, ...rest } = l;
          void _s;
          void _c;
          return { ...rest, url: "#" };
        }
        // Enable content mode
        return {
          ...l,
          slug: l.label
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
          content: "",
          url: `/legal/${l.label
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}`,
        };
      })
    );
  }

  function removeLink(id: string) {
    setLinks(links.filter((l) => l.id !== id));
  }

  function moveLink(id: string, direction: "up" | "down") {
    const sorted = [...links].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((l) => l.id === id);
    if (
      (direction === "up" && idx === 0) ||
      (direction === "down" && idx === sorted.length - 1)
    )
      return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const tempOrder = sorted[idx].order;
    sorted[idx].order = sorted[swapIdx].order;
    sorted[swapIdx].order = tempOrder;
    setLinks([...sorted]);
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/footer-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ legalLinks: links }),
      });
      if (res.ok) {
        setMessage("Guardado correctamente");
        setEditingId(null);
      } else {
        setMessage("Error al guardar");
      }
    } catch {
      setMessage("Error al guardar");
    }
    setSaving(false);
  }

  const sorted = [...links].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {sorted.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-400">
            No hay enlaces configurados
          </div>
        )}
        {sorted.map((link) => (
          <div key={link.id} className="p-4">
            {editingId === link.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Etiqueta
                    </label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) =>
                        updateLink(link.id, "label", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Ej: Política de Privacidad"
                    />
                  </div>
                  {!link.slug ? (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        URL externa
                      </label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) =>
                          updateLink(link.id, "url", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Ej: /privacidad o https://..."
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Slug (URL automática)
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">/legal/</span>
                        <input
                          type="text"
                          value={link.slug}
                          onChange={(e) =>
                            updateLink(
                              link.id,
                              "slug",
                              e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, "")
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="politica-privacidad"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Toggle content mode */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleContent(link.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      link.slug
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span className="material-icons text-sm">
                      {link.slug ? "check_circle" : "add_circle_outline"}
                    </span>
                    {link.slug
                      ? "Página con contenido propio"
                      : "Agregar página con contenido"}
                  </button>
                </div>

                {/* Content editor */}
                {link.slug && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Contenido de la página
                    </label>
                    <textarea
                      value={link.content || ""}
                      onChange={(e) =>
                        updateLink(link.id, "content", e.target.value)
                      }
                      rows={15}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono leading-relaxed"
                      placeholder="Escribe aquí el contenido de la página..."
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      El contenido se renderiza como texto con saltos de línea
                      preservados. Accesible en:{" "}
                      <span className="font-mono text-primary">
                        /legal/{link.slug}
                      </span>
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setEditingId(null)}
                  className="text-xs text-primary hover:underline"
                >
                  Listo
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveLink(link.id, "up")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <span className="material-icons text-base">
                        keyboard_arrow_up
                      </span>
                    </button>
                    <button
                      onClick={() => moveLink(link.id, "down")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <span className="material-icons text-base">
                        keyboard_arrow_down
                      </span>
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {link.label || "(sin nombre)"}
                      </p>
                      {link.slug && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                          Con contenido
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{link.url || "#"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(link.id)}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <span className="material-icons text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => removeLink(link.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-icons text-lg">delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={addLink}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="material-icons text-lg">add</span>
          Agregar enlace
        </button>
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
