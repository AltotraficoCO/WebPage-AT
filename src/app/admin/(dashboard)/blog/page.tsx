import BlogManager from "@/components/admin/BlogManager";

export default function BlogPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Blog - HubSpot
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Importa todos los artículos publicados de HubSpot a una copia propia. Los textos se editan en HubSpot y se actualizan con el botón de importación. Las imágenes conservan su URL de origen.
        </p>
      </div>
      <BlogManager />
    </div>
  );
}
