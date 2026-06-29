import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/panel/AdminDashboard";

export const metadata = { title: "Yönetim · Golden Oremar" };

export default async function AdminHome() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("admin_stats");
  return <AdminDashboard stats={(data ?? {}) as never} />;
}
