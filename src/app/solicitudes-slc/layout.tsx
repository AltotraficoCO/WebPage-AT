export default function SolicitudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {children}
    </div>
  );
}
