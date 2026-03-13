"use client";

import Link from "next/link";
import Image from "next/image";

interface PautaNavbarProps {
  logoUrl: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
}

export default function PautaNavbar({ logoUrl, logoAlt, logoWidth, logoHeight }: PautaNavbarProps) {
  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-20">
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
      </div>
    </nav>
  );
}
