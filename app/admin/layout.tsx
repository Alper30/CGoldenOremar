import { redirect } from "next/navigation";
import { getAuthSnapshot } from "@/lib/auth";
import { AdminNav } from "@/components/panel/AdminNav";

// Rol guard: yalnız yöneticiler.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getAuthSnapshot();
  if (!user) redirect("/giris");
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminNav />
      {children}
    </div>
  );
}
