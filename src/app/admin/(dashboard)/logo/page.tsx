import LogoManager from "@/components/admin/LogoManager";
import { readSettings } from "@/lib/storage";

export default async function LogoPage() {
  const settings = await readSettings();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Gestión de Logo
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Cambia el logo que aparece en el navbar y en el footer del sitio.
        </p>
      </div>
      <LogoManager initialSettings={settings} />
    </div>
  );
}
