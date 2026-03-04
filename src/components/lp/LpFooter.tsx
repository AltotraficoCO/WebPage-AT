import Link from "next/link";

export default function LpFooter() {
  return (
    <footer className="w-full border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-6 text-xs text-white/25">
        <Link href="/legal/privacidad" className="transition-colors hover:text-white/50">
          Privacidad
        </Link>
        <span>·</span>
        <Link href="/legal/terminos" className="transition-colors hover:text-white/50">
          Términos
        </Link>
      </div>
    </footer>
  );
}
