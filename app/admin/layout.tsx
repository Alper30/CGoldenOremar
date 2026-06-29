import { redirect } from "next/navigation";
import { getAuthSnapshot } from "@/lib/auth";
import { AdminShell } from "@/components/panel/AdminShell";

// Rol guard: yalnız yöneticiler.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getAuthSnapshot();
  if (!user) redirect("/giris");
  if (profile?.role !== "admin") redirect("/");

  return <AdminShell>{children}</AdminShell>;
}
