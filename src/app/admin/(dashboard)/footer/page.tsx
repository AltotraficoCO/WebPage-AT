import FooterLinksManager from "@/components/admin/FooterLinksManager";
import { readFooterLinks } from "@/lib/storage";

export default async function FooterPage() {
  const data = await readFooterLinks();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Footer Links</h2>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona los enlaces legales del pie de página (Privacidad, Términos,
          etc.)
        </p>
      </div>
      <FooterLinksManager initialLinks={data.legalLinks} />
    </div>
  );
}
