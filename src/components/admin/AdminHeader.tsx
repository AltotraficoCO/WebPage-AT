"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/logo": "Gestión de Logo",
  "/admin/footer": "Footer Links",
  "/admin/cases": "Casos de Éxito",
  "/admin/blog": "Blog - HubSpot",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Admin";

  return (
    <header className="bg-white border-b border-gray-200 px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AT</span>
            </div>
          </Link>
        </div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>
      <form action="/api/auth/signout" method="POST">
        <button
          type="submit"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="material-icons text-xl">logout</span>
          Cerrar sesión
        </button>
      </form>
    </header>
  );
}
