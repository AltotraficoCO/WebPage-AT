import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readUsers, writeUsers } from "@/lib/storage";
import type { AdminUser } from "@/types/admin";

export async function GET() {
  try {
    const users = await readUsers();
    // Return users without password hashes
    const safe = users.map(({ passwordHash: _pw, ...u }) => {
      void _pw;
      return u;
    });
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, id, username, email, password } = body as {
      action: "add" | "update" | "remove";
      id?: string;
      username?: string;
      email?: string;
      password?: string;
    };

    const users = await readUsers();

    if (action === "add") {
      if (!username || !email || !password) {
        return NextResponse.json(
          { error: "Todos los campos son requeridos" },
          { status: 400 }
        );
      }
      if (users.some((u) => u.username === username)) {
        return NextResponse.json(
          { error: "El nombre de usuario ya existe" },
          { status: 400 }
        );
      }
      if (users.length >= 10) {
        return NextResponse.json(
          { error: "Máximo 10 usuarios permitidos" },
          { status: 400 }
        );
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser: AdminUser = {
        id: Date.now().toString(),
        username: username.trim().slice(0, 50),
        email: email.trim().slice(0, 100),
        passwordHash,
      };
      await writeUsers([...users, newUser]);
      return NextResponse.json({ success: true });
    }

    if (action === "update") {
      if (!id) {
        return NextResponse.json(
          { error: "ID de usuario requerido" },
          { status: 400 }
        );
      }
      if (users.length <= 1) {
        return NextResponse.json(
          { error: "Debe haber al menos un usuario" },
          { status: 400 }
        );
      }
      const updated = users.map((u) => {
        if (u.id !== id) return u;
        return {
          ...u,
          ...(username && { username: username.trim().slice(0, 50) }),
          ...(email && { email: email.trim().slice(0, 100) }),
        };
      });

      // If password provided, hash it
      if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        const idx = updated.findIndex((u) => u.id === id);
        if (idx >= 0) updated[idx].passwordHash = passwordHash;
      }

      await writeUsers(updated);
      return NextResponse.json({ success: true });
    }

    if (action === "remove") {
      if (!id) {
        return NextResponse.json(
          { error: "ID de usuario requerido" },
          { status: 400 }
        );
      }
      if (users.length <= 1) {
        return NextResponse.json(
          { error: "No puedes eliminar el último usuario" },
          { status: 400 }
        );
      }
      await writeUsers(users.filter((u) => u.id !== id));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar usuarios" },
      { status: 500 }
    );
  }
}
