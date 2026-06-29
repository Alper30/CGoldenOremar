import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminDashboard, type Stats } from "@/components/panel/AdminDashboard";

export const metadata = { title: "Yönetim · Golden Oremar" };

export default async function AdminHome() {
  const supabase = await createSupabaseServerClient();
  // admin_stats RPC `Json` döner; bilinen şekle (Stats) köprülenir.
  const { data } = await supabase.rpc("admin_stats");
  return <AdminDashboard stats={(data ?? {}) as unknown as Stats} />;
}
