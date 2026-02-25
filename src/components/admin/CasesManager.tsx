"use client";

import { useState } from "react";
import type { CaseStudy } from "@/types/admin";

interface Props {
  initialCases: CaseStudy[];
}

export default function CasesManager({ initialCases }: Props) {
  const [cases, setCases] = useState<CaseStudy[]>(initialCases);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  function addCase() {
    const newCase: CaseStudy = {
      id: Date.now().toString(),
      imageUrl: "",
      imageAlt: "",
      tag: "",
      title: "",
      description: "",
      stat1Label: "",
      stat1Value: "",
      stat2Label: "",
      stat2Value: "",
      order: cases.length + 1,
    };
    setCases([...cases, newCase]);
    setEditingId(newCase.id);
  }

  function updateCase(id: string, field: keyof CaseStudy, value: string | number) {
    setCases(cases.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function removeCase(id: string) {
    setCases(cases.filter((c) => c.id !== id));
  }

  function moveCase(id: string, direction: "up" | "down") {
    const sorted = [...cases].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((c) => c.id === id);
    if (
      (direction === "up" && idx === 0) ||
      (direction === "down" && idx === sorted.length - 1)
    )
      return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const tempOrder = sorted[idx].order;
    sorted[idx].order = sorted[swapIdx].order;
    sorted[swapIdx].order = tempOrder;
    setCases([...sorted]);
  }

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    caseId: string
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(caseId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        updateCase(caseId, "imageUrl", data.url);
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
      const res = await fetch("/api/admin/cases", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cases }),
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

  const sorted = [...cases].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {sorted.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            {editingId === c.id ? (
              <div className="p-6 space-y-4">
                {/* Image */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Imagen
                  </label>
                  <div className="flex items-center gap-4">
                    {c.imageUrl && (
                      <img
                        src={c.imageUrl}
                        alt=""
                        className="w-32 h-20 object-cover rounded-lg bg-gray-100"
                      />
                    )}
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer transition-colors">
                      <span className="material-icons text-lg">upload</span>
                      {uploading === c.id ? "Subiendo..." : "Subir imagen"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUpload(e, c.id)}
                        disabled={uploading !== null}
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    value={c.imageUrl}
                    onChange={(e) => updateCase(c.id, "imageUrl", e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="O pegar URL de imagen"
                  />
                </div>

                {/* Tag + Title */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Tag / Industria
                    </label>
                    <input
                      type="text"
                      value={c.tag}
                      onChange={(e) => updateCase(c.id, "tag", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Ej: Fintech"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      value={c.title}
                      onChange={(e) => updateCase(c.id, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Ej: Automatización de Reportes"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={c.description}
                    onChange={(e) =>
                      updateCase(c.id, "description", e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    placeholder="Descripción breve del caso..."
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Métrica 1
                      </label>
                      <input
                        type="text"
                        value={c.stat1Label}
                        onChange={(e) =>
                          updateCase(c.id, "stat1Label", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Ej: Eficiencia"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Valor
                      </label>
                      <input
                        type="text"
                        value={c.stat1Value}
                        onChange={(e) =>
                          updateCase(c.id, "stat1Value", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Ej: +85%"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Métrica 2
                      </label>
                      <input
                        type="text"
                        value={c.stat2Label}
                        onChange={(e) =>
                          updateCase(c.id, "stat2Label", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Ej: Ahorro"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Valor
                      </label>
                      <input
                        type="text"
                        value={c.stat2Value}
                        onChange={(e) =>
                          updateCase(c.id, "stat2Value", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Ej: 120h/mes"
                      />
                    </div>
                  </div>
                </div>

                {/* Image alt */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Texto alternativo de imagen
                  </label>
                  <input
                    type="text"
                    value={c.imageAlt}
                    onChange={(e) =>
                      updateCase(c.id, "imageAlt", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Descripción de la imagen para accesibilidad"
                  />
                </div>

                <button
                  onClick={() => setEditingId(null)}
                  className="text-xs text-primary hover:underline"
                >
                  Listo
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveCase(c.id, "up")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-icons text-base">
                      keyboard_arrow_up
                    </span>
                  </button>
                  <button
                    onClick={() => moveCase(c.id, "down")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-icons text-base">
                      keyboard_arrow_down
                    </span>
                  </button>
                </div>
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt=""
                    className="w-24 h-16 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {c.tag && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {c.tag}
                      </span>
                    )}
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {c.title || "(sin título)"}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {c.description || "(sin descripción)"}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditingId(c.id)}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <span className="material-icons text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => removeCase(c.id)}
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

      {cases.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <span className="material-icons text-4xl text-gray-300 mb-3">
            work
          </span>
          <p className="text-sm text-gray-500">
            No hay casos de éxito configurados
          </p>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={addCase}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="material-icons text-lg">add</span>
          Agregar caso
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
