import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UsersTable, type AdminUser } from "@/components/admin/UsersTable";

export const metadata = { title: "Kullanıcılar · Yönetim" };

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role, suspended, created_at")
    .order("created_at", { ascending: false });

  return <UsersTable users={(users ?? []) as unknown as AdminUser[]} />;
}
