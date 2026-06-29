import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/panel/SettingsForm";

export const metadata = { title: "Ayarlar · Yönetim" };

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("platform_settings")
    .select("commission_rate, escrow_auto_confirm_days, free_shipping_threshold, shipping_fee")
    .eq("id", true)
    .single();

  if (!data) return null;
  return <SettingsForm settings={data} />;
}
