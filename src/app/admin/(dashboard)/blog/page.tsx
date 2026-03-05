import BlogManager from "@/components/admin/BlogManager";

export default function BlogPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Blog - HubSpot
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Visualiza y gestiona los artículos publicados desde HubSpot.
        </p>
      </div>
      <BlogManager />
    </div>
  );
}
