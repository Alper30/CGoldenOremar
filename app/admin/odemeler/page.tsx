import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PayoutsManager } from "@/components/panel/PayoutsManager";

export const metadata = { title: "Ödemeler · Yönetim" };

export default async function AdminPayoutsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("payouts")
    .select("id, amount, iban, created_at, vendor_profiles(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return <PayoutsManager payouts={(data ?? []) as never} />;
}
