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
    <nav className="fixed w-full z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <Image
              alt={logoAlt}
              className="h-8 md:h-10 w-auto object-contain brightness-0 invert"
              src={logoUrl}
              width={logoWidth}
              height={logoHeight}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-normal text-zinc-400 hover:text-white transition"
            >
              Inicio
            </Link>
            <Link
              href="/servicios"
              className="text-sm font-normal text-zinc-400 hover:text-white transition"
            >
              Servicios
            </Link>
            <Link
              href="/diagnostico-ia"
              className="relative inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium text-white bg-accent-purple/20 border border-accent-purple/40 hover:bg-accent-purple/30 transition-all"
            >
              Solicitar Diagnostico
            </Link>
          </div>

          <button
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="material-icons">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-dark-surface border-t border-dark-border px-4 py-6 space-y-4">
          <Link
            href="/"
            className="block text-sm text-zinc-400 hover:text-white transition"
            onClick={() => setMobileOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/servicios"
            className="block text-sm text-zinc-400 hover:text-white transition"
            onClick={() => setMobileOpen(false)}
          >
            Servicios
          </Link>
          <Link
            href="/diagnostico-ia"
            className="block text-center px-5 py-2.5 rounded-full text-sm font-medium text-white bg-accent-purple/20 border border-accent-purple/40 transition"
            onClick={() => setMobileOpen(false)}
          >
            Solicitar Diagnostico
          </Link>
        </div>
      )}
    </nav>
  );
}
