import CasesManager from "@/components/admin/CasesManager";
import { readCases } from "@/lib/storage";

export default async function CasesPage() {
  const data = await readCases();

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Casos de Éxito
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona los casos que aparecen en la sección &quot;Sistemas que ya
          están funcionando&quot; de la página principal.
        </p>
      </div>
      <CasesManager initialCases={data.cases} />
    </div>
  );
}
