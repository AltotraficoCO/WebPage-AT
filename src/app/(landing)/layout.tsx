import DarkNavbar from "@/components/landing/DarkNavbar";
import DarkFooter from "@/components/landing/DarkFooter";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <DarkNavbar />
      {children}
      <DarkFooter />
    </div>
  );
}
