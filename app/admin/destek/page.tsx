import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SupportInbox, type SupportMessage } from "@/components/admin/SupportInbox";

export const metadata = { title: "Destek / Mesajlar · Yönetim" };

export default async function AdminSupportPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("support_messages")
    .select("id, name, email, phone, subject, body, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return <SupportInbox messages={(data ?? []) as unknown as SupportMessage[]} />;
}
