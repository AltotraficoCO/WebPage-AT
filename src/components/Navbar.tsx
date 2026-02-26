"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  logoUrl: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
}

export default function Navbar({ logoUrl, logoAlt, logoWidth, logoHeight }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/servicios", label: "Servicios" },
    { href: "/diagnostico-ia", label: "Diagnóstico IA" },
  ];

  function linkClass(href: string) {
    const isActive = pathname === href;
    return isActive
      ? "text-sm font-medium text-primary transition border-b-2 border-primary"
      : "text-sm font-normal text-gray-600 hover:text-primary transition";
  }

  return (
    <nav className="fixed w-full z-50 bg-background-light/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
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
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://app.altotrafico.co"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tech btn-tech-outline px-5 py-2.5 rounded-full text-sm font-medium"
            >
              Zona clientes
            </a>
            <Link
              href="/contacto"
              className="btn-tech bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-primary/20"
            >
              Contacto
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              className="text-gray-500 hover:text-primary"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="material-icons">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block ${linkClass(link.href)}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://app.altotrafico.co"
            target="_blank"
            rel="noopener noreferrer"
            className="block btn-tech btn-tech-outline px-5 py-2.5 rounded-full text-sm font-medium text-center"
            onClick={() => setMobileOpen(false)}
          >
            Zona clientes
          </a>
          <Link
            href="/contacto"
            className="block btn-tech bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium text-center shadow-lg shadow-primary/20"
            onClick={() => setMobileOpen(false)}
          >
            Contacto
          </Link>
        </div>
      )}
    </nav>
  );
}
