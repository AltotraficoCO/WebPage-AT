import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Alto Tráfico - Admin",
};

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
