"use client";

import { useState, useEffect } from "react";

interface UserSafe {
  id: string;
  username: string;
  email: string;
}

export default function UsersManager() {
  const [users, setUsers] = useState<UserSafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch {
      setMessage("Error al cargar usuarios");
    }
    setLoading(false);
  }

  async function handleAdd() {
    if (!newUsername.trim() || !newEmail.trim() || !newPassword.trim()) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          username: newUsername,
          email: newEmail,
          password: newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Usuario creado");
        setNewUsername("");
        setNewEmail("");
        setNewPassword("");
        setShowAdd(false);
        fetchUsers();
      } else {
        setMessage(data.error || "Error al crear usuario");
      }
    } catch {
      setMessage("Error de conexión");
    }
    setSaving(false);
  }

  async function handleChangePassword(id: string) {
    if (!editPassword.trim()) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id,
          password: editPassword,
        }),
      });
      if (res.ok) {
        setMessage("Contraseña actualizada");
        setEditingId(null);
        setEditPassword("");
      } else {
        const data = await res.json();
        setMessage(data.error || "Error al actualizar");
      }
    } catch {
      setMessage("Error de conexión");
    }
    setSaving(false);
  }

  async function handleRemove(id: string) {
    if (!confirm("¿Eliminar este usuario?")) return;
    setMessage("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", id }),
      });
      if (res.ok) {
        setMessage("Usuario eliminado");
        fetchUsers();
      } else {
        const data = await res.json();
        setMessage(data.error || "Error al eliminar");
      }
    } catch {
      setMessage("Error de conexión");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-gray-500 p-8">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        Cargando usuarios...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {users.map((user) => (
          <div key={user.id} className="p-4">
            {editingId === user.id ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Nueva contraseña
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Nueva contraseña"
                    />
                    <button
                      onClick={() => handleChangePassword(user.id)}
                      disabled={saving || !editPassword.trim()}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {saving ? "Guardando..." : "Cambiar"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditPassword("");
                      }}
                      className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(user.id)}
                    className="text-gray-400 hover:text-primary transition-colors"
                    title="Cambiar contraseña"
                  >
                    <span className="material-icons text-lg">key</span>
                  </button>
                  <button
                    onClick={() => handleRemove(user.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Eliminar usuario"
                    disabled={users.length <= 1}
                  >
                    <span className="material-icons text-lg">delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {users.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-400">
            No hay usuarios configurados
          </div>
        )}
      </div>

      {showAdd ? (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">
            Agregar usuario
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Usuario
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="admin@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Contraseña segura"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAdd}
              disabled={
                saving ||
                !newUsername.trim() ||
                !newEmail.trim() ||
                !newPassword.trim()
              }
              className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Creando..." : "Crear usuario"}
            </button>
            <button
              onClick={() => {
                setShowAdd(false);
                setNewUsername("");
                setNewEmail("");
                setNewPassword("");
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="material-icons text-lg">person_add</span>
          Agregar usuario
        </button>
      )}

      {message && (
        <p
          className={`text-sm ${
            message.includes("Error") || message.includes("error")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
