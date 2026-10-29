"use client";
import { useEffect, useState } from "react";
import type { MarketingContent, MarketingState } from "@/lib/marketing";

type Node = string | Node[] | { [key: string]: Node };
const labels: Record<string, string> = {
  headline: "Título principal",
  title: "Título",
  lead: "Descripción principal",
  imageUrl: "Imagen",
  imageAlt: "Descripción de la imagen",
  seoTitle: "Título para Google",
  tag: "Etiqueta superior",
  cta: "Texto del botón",
  units: "Título de las unidades",
  unitsText: "Presentación de las unidades",
  how: "Título de la metodología",
  steps: "Pasos de trabajo",
  principles: "Principios",
  next: "Título de cierre",
  nextText: "Ubicación y cobertura",
  name: "Nombre",
  summary: "Resumen en la portada",
  tags: "Lista de especialidades",
  result: "Título del resultado",
  resultText: "Descripción del resultado",
  items: "Servicios incluidos",
  commercial: "Modalidad comercial",
  faqs: "Preguntas frecuentes",
  scope: "Etiqueta de alcance",
  method: "Etiqueta de modalidad",
  faq: "Título de preguntas frecuentes",
};
const inputClass =
  "w-full rounded-lg border border-gray-300 p-3 text-sm bg-white text-gray-900";
function readable(value: string) {
  return value.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<\/?span>/gi, "**");
}
function markup(value: string) {
  let open = false;
  return value
    .replace(/\*\*/g, () => {
      open = !open;
      return open ? "<span>" : "</span>";
    })
    .replaceAll("\n", "<br>");
}
function Field({
  value,
  field,
  onChange,
}: {
  value: Node;
  field: string;
  onChange: (value: Node) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const label = labels[field] || field;
  if (typeof value === "string")
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-800">
          {label}
          {field === "imageUrl" ? (
            <input
              className={inputClass}
              type="url"
              placeholder="URL de imagen o subir archivo"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          ) : (
            <textarea
              className={inputClass}
              rows={value.length > 140 ? 4 : 2}
              value={readable(value)}
              onChange={(e) => onChange(markup(e.target.value))}
            />
          )}
        </label>
        {field === "imageUrl" && (
          <>
            <label className="block text-sm">
              {uploading ? "Subiendo imagen…" : "Subir imagen (máximo 5 MB)"}
              <input
                className="block mt-2"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  setError("");
                  try {
                    const form = new FormData();
                    form.append("file", file);
                    const res = await fetch("/api/admin/upload", {
                      method: "POST",
                      body: form,
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error);
                    onChange(data.url);
                  } catch (err) {
                    setError(
                      err instanceof Error ? err.message : "Error al subir",
                    );
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            </label>
            {value && (
              <img
                src={value}
                alt="Vista de la imagen seleccionada"
                className="max-h-48 rounded-lg"
              />
            )}
            {error && (
              <p role="alert" className="text-red-700">
                {error}
              </p>
            )}
          </>
        )}
      </div>
    );
  if (Array.isArray(value)) {
    const pair = typeof value[0] === "string";
    return (
      <fieldset className="border rounded-xl p-4 space-y-4">
        <legend className="font-semibold px-2">{label}</legend>
        {value.map((item, i) => (
          <div key={i} className="space-y-3">
            <Field
              value={item}
              field={
                pair
                  ? i === 0
                    ? "Título / pregunta"
                    : "Texto / respuesta"
                  : `${label} ${i + 1}`
              }
              onChange={(next) =>
                onChange(value.map((v, n) => (n === i ? next : v)))
              }
            />
            {!pair && (
              <div className="flex gap-4 text-sm">
                <button
                  type="button"
                  disabled={value.length <= 1}
                  onClick={() => onChange(value.filter((_, n) => n !== i))}
                >
                  Eliminar elemento
                </button>
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => {
                    const next = [...value];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    onChange(next);
                  }}
                >
                  Subir ↑
                </button>
              </div>
            )}
          </div>
        ))}
        {!pair && (
          <button
            type="button"
            className="border rounded-lg p-2"
            onClick={() =>
              onChange([...value, ["Nuevo título", "Nuevo texto"]])
            }
          >
            + Añadir elemento
          </button>
        )}
      </fieldset>
    );
  }
  return (
    <div className="space-y-6">
      {Object.entries(value).map(([key, item]) => (
        <Field
          key={key}
          value={item}
          field={key}
          onChange={(next) => onChange({ ...value, [key]: next })}
        />
      ))}
    </div>
  );
}
export default function ContentManager() {
  const [state, setState] = useState<MarketingState | null>(null);
  const [content, setContent] = useState<MarketingContent | null>(null);
  const [locale, setLocale] = useState<"es" | "en">("es");
  const [section, setSection] = useState("home");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("/api/admin/marketing")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setState(data);
        setContent(data.draft);
      })
      .catch((e) => setMessage(e.message));
  }, []);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  async function save(action: "draft" | "publish" | "restore") {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, version: state?.version, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setState(data);
      setContent(data.draft);
      setDirty(false);
      setMessage(
        action === "draft"
          ? "Borrador guardado. El sitio público no cambió."
          : "Publicación actualizada. Ya está disponible en la web.",
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setBusy(false);
    }
  }
  if (!content || !state)
    return <p role="status">{message || "Cargando contenido…"}</p>;
  const homeKeys = [
    "tag",
    "headline",
    "lead",
    "imageUrl",
    "imageAlt",
    "seoTitle",
    "cta",
    "units",
    "unitsText",
    "how",
    "steps",
    "principles",
    "next",
    "nextText",
    "scope",
    "faq",
  ];
  const value = (
    section === "home"
      ? Object.fromEntries(
          homeKeys.map((k) => [
            k,
            content[locale][k as keyof typeof content.es],
          ]),
        )
      : content[locale].services[section as keyof typeof content.es.services]
  ) as Node;
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Contenido de la web</h2>
        <p className="text-gray-600 mt-2">
          Edita la portada y las tres unidades. Usa saltos de línea y **texto
          resaltado** en los títulos. Cada idioma se edita por separado.
        </p>
      </div>
      <div className="sticky top-0 z-10 bg-white border rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          <label>
            Idioma{" "}
            <select
              className="border rounded p-2"
              value={locale}
              onChange={(e) => setLocale(e.target.value as "es" | "en")}
            >
              <option value="es">🇨🇴 Español</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </label>
          <label>
            Sección{" "}
            <select
              className="border rounded p-2"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="home">Portada y textos compartidos</option>
              <option value="growth">Growth Operations</option>
              <option value="ai">AI & Automation</option>
              <option value="tech">Technology & Development</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            disabled={busy}
            className="border rounded-lg px-4 py-2"
            onClick={() => save("draft")}
          >
            Guardar borrador
          </button>
          <a
            aria-disabled={dirty}
            className={dirty ? "pointer-events-none opacity-40" : "underline"}
            target="_blank"
            rel="noopener"
            href={`/api/admin/marketing/preview?locale=${locale}&page=${section}`}
          >
            Ver borrador guardado ↗
          </a>
          <button
            disabled={busy}
            className="bg-primary text-white rounded-lg px-4 py-2"
            onClick={() => save("publish")}
          >
            {busy ? "Guardando…" : "Publicar cambios"}
          </button>
          {state.previous && (
            <button
              disabled={busy}
              className="text-sm underline"
              onClick={() => {
                if (
                  window.confirm(
                    "¿Restaurar la publicación anterior? Los cambios actuales serán reemplazados.",
                  )
                )
                  save("restore");
              }}
            >
              Restaurar publicación anterior
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {dirty
            ? "Hay cambios sin guardar. Guarda el borrador para previsualizar."
            : `Versión ${state.version} · ${state.publishedAt ? `Última publicación: ${new Date(state.publishedAt).toLocaleString()}` : "Diseño inicial publicado"}`}
        </p>
        <p role="status" className="text-sm font-medium">
          {message}
        </p>
      </div>
      <div className="bg-white border rounded-xl p-6">
        <Field
          field={section}
          value={value}
          onChange={(next) => {
            const updated = structuredClone(content);
            if (section === "home") Object.assign(updated[locale], next);
            else
              updated[locale].services[
                section as keyof typeof content.es.services
              ] = next as typeof content.es.services.growth;
            setContent(updated);
            setDirty(true);
          }}
        />
      </div>
    </div>
  );
}
