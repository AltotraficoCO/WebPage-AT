import UsersManager from "@/components/admin/UsersManager";

export default function UsersPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Usuarios
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona los usuarios que pueden acceder al panel de administración.
        </p>
      </div>
      <UsersManager />
    </div>
  );
}
