import Image from "next/image";
import type { CaseStudy } from "@/types/admin";

interface Props {
  cases: CaseStudy[];
}

export default function CasesSection({ cases }: Props) {
  const sorted = [...cases].sort((a, b) => a.order - b.order);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
            <span className="text-xs font-medium tracking-wider text-primary uppercase mb-3 block">
              Casos de Éxito
            </span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-6">
              Sistemas que ya están <br />
              funcionando
            </h2>
            <p className="text-lg text-gray-500 font-normal leading-relaxed">
              Resultados tangibles en industrias competitivas, impulsados por
              arquitecturas inteligentes.
            </p>
          </div>
          <a
            className="group inline-flex items-center text-sm font-medium text-gray-900 hover:text-primary transition-all duration-300 mt-8 md:mt-0 border-b border-gray-300 pb-1 hover:border-primary"
            href="#"
          >
            Ver todos los casos
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform material-icons text-base">
              arrow_forward
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {sorted.map((c) => (
            <div
              key={c.id}
              className="case-card group relative bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                {c.imageUrl && (
                  <Image
                    alt={c.imageAlt}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    src={c.imageUrl}
                    width={800}
                    height={450}
                  />
                )}
                <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-500" />
                {c.tag && (
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="case-tag inline-block py-1 px-3 rounded-full bg-white/90 text-xs font-medium text-gray-800 border border-gray-100 shadow-sm">
                      {c.tag}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-8 relative">
                <h3 className="text-2xl font-medium text-gray-900 mb-2">
                  {c.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-normal mb-6">
                  {c.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide block mb-1 font-normal">
                      {c.stat1Label}
                    </span>
                    <span className="text-lg font-normal text-primary">
                      {c.stat1Value}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide block mb-1 font-normal">
                      {c.stat2Label}
                    </span>
                    <span className="text-lg font-normal text-primary">
                      {c.stat2Value}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                    <span className="material-icons text-sm">
                      arrow_outward
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
