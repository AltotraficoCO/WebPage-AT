"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface DarkNavbarProps {
  logoUrl: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
}

export default function DarkNavbar({ logoUrl, logoAlt, logoWidth, logoHeight }: DarkNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <Image
              alt={logoAlt}
              className="h-8 md:h-10 w-auto object-contain"
              src={logoUrl}
              width={logoWidth}
              height={logoHeight}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-normal text-gray-600 hover:text-primary transition"
            >
              Inicio
            </Link>
            <Link
              href="/servicios"
              className="text-sm font-normal text-gray-600 hover:text-primary transition"
            >
              Servicios
            </Link>
            <Link
              href="/diagnostico-ia"
              className="relative inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all"
            >
              Solicitar Diagnostico
            </Link>
          </div>

          <button
            className="md:hidden text-gray-600 hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="material-icons">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-6 space-y-4">
          <Link
            href="/"
            className="block text-sm text-gray-600 hover:text-primary transition"
            onClick={() => setMobileOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/servicios"
            className="block text-sm text-gray-600 hover:text-primary transition"
            onClick={() => setMobileOpen(false)}
          >
            Servicios
          </Link>
          <Link
            href="/diagnostico-ia"
            className="block text-center px-5 py-2.5 rounded-full text-sm font-medium text-white bg-primary hover:bg-primary/90 transition"
            onClick={() => setMobileOpen(false)}
          >
            Solicitar Diagnostico
          </Link>
        </div>
      )}
    </nav>
  );
}
