import { redirect } from "next/navigation";
import { getAuthSnapshot } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

// Rol guard: yalnız yöneticiler. Sidebar rozetleri (bekleyen sayıları) sunucuda hesaplanır.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getAuthSnapshot();
  if (!user) redirect("/giris");
  if (profile?.role !== "admin") redirect("/");

  const supabase = await createSupabaseServerClient();
  const { data: stats } = await supabase.rpc("admin_stats");
  const s = (stats ?? {}) as Record<string, number>;
  const badges = {
    pending_applications: Number(s.pending_applications ?? 0),
    pending_products: Number(s.pending_products ?? 0),
    pending_payouts: Number(s.pending_payouts ?? 0),
  };
  const initial = profile?.full_name?.trim() || user.email || "AD";

  return (
    <AdminShell badges={badges} userInitial={initial}>
      {children}
    </AdminShell>
  );
}
