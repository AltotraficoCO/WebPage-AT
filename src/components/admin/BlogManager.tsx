"use client";

import { useState, useEffect } from "react";
import type { HubSpotBlogPost } from "@/types/admin";

type ConnectionStatus = "loading" | "disconnected" | "connected" | "error";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export default function BlogManager() {
  const [status, setStatus] = useState<ConnectionStatus>("loading");
  const [tokenPreview, setTokenPreview] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [configMessage, setConfigMessage] = useState("");

  const [posts, setPosts] = useState<HubSpotBlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  // Check connection status on mount
  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/hubspot-config");
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.configured) {
        setTokenPreview(data.tokenPreview);
        setStatus("connected");
        fetchPosts();
      } else {
        setStatus("disconnected");
      }
    } catch {
      setStatus("error");
    }
  }

  async function handleSaveToken() {
    if (!tokenInput.trim()) return;
    setSaving(true);
    setConfigMessage("");
    try {
      const res = await fetch("/api/admin/hubspot-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: tokenInput.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setConfigMessage(`Conectado. ${data.total} artículo${data.total !== 1 ? "s" : ""} encontrado${data.total !== 1 ? "s" : ""}.`);
        setTokenInput("");
        setTotalPosts(data.total);
        setStatus("connected");
        checkConnection();
      } else {
        setConfigMessage(data.error || "Error al guardar");
      }
    } catch {
      setConfigMessage("Error de conexión");
    }
    setSaving(false);
  }

  async function handleTestConnection() {
    setTesting(true);
    setConfigMessage("");
    try {
      const res = await fetch("/api/admin/hubspot-config", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setConfigMessage(`Conexión exitosa. ${data.total} artículo${data.total !== 1 ? "s" : ""} encontrado${data.total !== 1 ? "s" : ""}.`);
      } else {
        setConfigMessage(data.error || "Error en la conexión");
      }
    } catch {
      setConfigMessage("Error al probar la conexión");
    }
    setTesting(false);
  }

  async function handleDisconnect() {
    try {
      const res = await fetch("/api/admin/hubspot-config", { method: "DELETE" });
      if (res.ok) {
        setStatus("disconnected");
        setTokenPreview("");
        setPosts([]);
        setTotalPosts(0);
        setConfigMessage("");
      }
    } catch {
      setConfigMessage("Error al desconectar");
    }
  }

  async function checkImages(postList: HubSpotBlogPost[]) {
    const broken = new Set<string>();
    await Promise.all(
      postList.map(
        (post) =>
          new Promise<void>((resolve) => {
            if (!post.featuredImage) {
              broken.add(post.id);
              resolve();
              return;
            }
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => {
              broken.add(post.id);
              resolve();
            };
            img.src = post.featuredImage;
          })
      )
    );
    setBrokenImages(broken);
  }

  async function fetchPosts() {
    setPostsLoading(true);
    setPostsError("");
    try {
      const res = await fetch("/api/admin/blog");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al obtener posts");
      }
      const data = await res.json();
      const results = data.results || [];
      setPosts(results);
      setTotalPosts(data.total || 0);
      checkImages(results);
    } catch (err) {
      setPostsError(
        err instanceof Error ? err.message : "Error al conectar con HubSpot"
      );
    }
    setPostsLoading(false);
  }

  async function handleSync() {
    setSyncing(true);
    await fetchPosts();
    setSyncing(false);
  }

  return (
    <div className="space-y-8">
      {/* Connection Config Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${
              status === "connected" ? "bg-green-500" :
              status === "loading" ? "bg-yellow-400 animate-pulse" :
              "bg-gray-300"
            }`} />
            <h3 className="text-sm font-semibold text-gray-900">
              Conexión con HubSpot
            </h3>
          </div>
          {status === "connected" && (
            <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
              Conectado
            </span>
          )}
        </div>

        <div className="p-5">
          {status === "loading" && (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Verificando conexión...
            </div>
          )}

          {status === "disconnected" && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                <span className="material-icons text-amber-500 text-xl mt-0.5">info</span>
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-2">Configura tu token de HubSpot</p>
                  <ol className="text-amber-700 text-xs leading-relaxed space-y-1 list-decimal list-inside">
                    <li>Ve a <strong>HubSpot &rarr; Settings &rarr; Integrations &rarr; Private Apps</strong></li>
                    <li>Crea una nueva app (o edita una existente)</li>
                    <li>En <strong>Scopes</strong>, busca <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">CMS</code> y activa <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">Blog &rarr; Read</code> (scope: <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">content</code>)</li>
                    <li>Guarda la app y copia el <strong>Access Token</strong></li>
                  </ol>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Access Token
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                    placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  />
                  <button
                    onClick={handleSaveToken}
                    disabled={saving || !tokenInput.trim()}
                    className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {saving ? "Verificando..." : "Conectar"}
                  </button>
                </div>
              </div>

              {configMessage && (
                <div className={`text-sm p-3 rounded-lg ${
                  configMessage.includes("Error") || configMessage.includes("inválido") || configMessage.includes("scope")
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}>
                  {configMessage}
                </div>
              )}
            </div>
          )}

          {status === "connected" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm text-gray-600">
                  <span className="text-gray-400">Token:</span>{" "}
                  <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{tokenPreview}</code>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors disabled:opacity-50"
                  >
                    <span className={`material-icons text-sm ${testing ? "animate-spin" : ""}`}>
                      {testing ? "sync" : "wifi_tethering"}
                    </span>
                    {testing ? "Probando..." : "Probar conexión"}
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className="material-icons text-sm">link_off</span>
                    Desconectar
                  </button>
                </div>
              </div>

              {configMessage && (
                <p className={`text-sm ${configMessage.includes("Error") || configMessage.includes("error") ? "text-red-600" : "text-green-600"}`}>
                  {configMessage}
                </p>
              )}
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-4">
              <span className="material-icons text-3xl text-gray-300 mb-2">error_outline</span>
              <p className="text-sm text-gray-500 mb-3">Error al verificar la configuración</p>
              <button
                onClick={checkConnection}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Blog Posts Section - only show when connected */}
      {status === "connected" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <p className="text-sm text-gray-500">
                {totalPosts} artículo{totalPosts !== 1 ? "s" : ""} en HubSpot
              </p>
              {brokenImages.size > 0 && (
                <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium">
                  <span className="material-icons text-xs">visibility_off</span>
                  {brokenImages.size} oculto{brokenImages.size !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors disabled:opacity-50"
            >
              <span className={`material-icons text-lg ${syncing ? "animate-spin" : ""}`}>
                sync
              </span>
              {syncing ? "Sincronizando..." : "Sincronizar"}
            </button>
          </div>

          {postsLoading && !syncing ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">Cargando artículos...</p>
            </div>
          ) : postsError ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="text-center">
                <span className="material-icons text-4xl text-gray-300 mb-3">
                  cloud_off
                </span>
                <p className="text-sm text-gray-500 mb-4">{postsError}</p>
                <button
                  onClick={fetchPosts}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <span className="material-icons text-4xl text-gray-300 mb-3">
                article
              </span>
              <p className="text-sm text-gray-500">
                No hay artículos publicados en HubSpot
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Crea y publica un artículo en tu blog de HubSpot y luego sincroniza.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {posts.map((post) => {
                const isBroken = brokenImages.has(post.id);
                return (
                  <div key={post.id} className={`p-4 ${isBroken ? "opacity-60" : ""}`}>
                    <div className="flex items-start gap-4">
                      {post.featuredImage && !isBroken && (
                        <img
                          src={post.featuredImage}
                          alt=""
                          className="w-20 h-14 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                        />
                      )}
                      {isBroken && (
                        <div className="w-20 h-14 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                          <span className="material-icons text-red-300 text-lg">broken_image</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {post.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {stripHtml(post.postSummary || post.metaDescription)}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-400">
                            {new Date(post.publishDate).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          {post.authorName && (
                            <span className="text-xs text-gray-400">
                              por {post.authorName}
                            </span>
                          )}
                        </div>
                      </div>
                      <a
                        href={`/blog/${post.slug}`}
                        className="flex-shrink-0 text-gray-400 hover:text-primary transition-colors"
                        title="Ver en el sitio"
                      >
                        <span className="material-icons text-lg">open_in_new</span>
                      </a>
                    </div>
                    {isBroken && (
                      <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                        <span className="material-icons text-red-400 text-sm">visibility_off</span>
                        <span className="text-xs font-medium text-red-600">Oculto en el sitio</span>
                        <span className="text-xs text-red-400">
                          — {post.featuredImage ? "La imagen destacada no carga (URL rota)" : "No tiene imagen destacada"}. Actualiza la imagen en HubSpot.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
