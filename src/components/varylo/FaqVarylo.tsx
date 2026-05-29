"use client";

import { useState } from "react";
import type { FaqItem } from "@/data/varylo";

export default function FaqVarylo({ items }: { items: FaqItem[] }) {
  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
      {items.map((item, i) => {
        const activo = abierto === i;
        return (
          <div key={item.pregunta}>
            <button
              onClick={() => setAbierto(activo ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={activo}
            >
              <span className="font-medium text-primary">{item.pregunta}</span>
              <span
                className={`material-icons text-gray-400 transition-transform ${
                  activo ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
            {activo && (
              <p className="px-6 pb-5 text-gray-600 animate-fade-in-left">
                {item.respuesta}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
