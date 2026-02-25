import Link from "next/link";

const sections = [
  {
    title: "Logo",
    description: "Cambiar el logo del sitio en navbar y footer",
    href: "/admin/logo",
    icon: "image",
  },
  {
    title: "Footer Links",
    description: "Gestionar enlaces legales del pie de página",
    href: "/admin/footer",
    icon: "link",
  },
  {
    title: "Casos de Éxito",
    description: "Gestionar casos de la página principal",
    href: "/admin/cases",
    icon: "work",
  },
  {
    title: "Blog",
    description: "Ver y gestionar publicaciones de HubSpot",
    href: "/admin/blog",
    icon: "article",
  },
  {
    title: "Usuarios",
    description: "Gestionar accesos al panel de administración",
    href: "/admin/users",
    icon: "people",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Bienvenido al panel de administración
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona el contenido de tu sitio web desde aquí.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all group"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <span className="material-icons text-primary">
                {section.icon}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {section.title}
            </h3>
            <p className="text-sm text-gray-500">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
