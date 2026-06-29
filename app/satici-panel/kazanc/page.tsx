import { getMyVendor } from "@/lib/vendor";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EarningsView } from "@/components/panel/EarningsView";

export const metadata = { title: "Kazanç · Golden Oremar" };

export default async function VendorEarningsPage() {
  const vendor = await getMyVendor();
  if (!vendor) return null;

  const supabase = await createSupabaseServerClient();
  const [txnRes, payoutRes] = await Promise.all([
    supabase
      .from("vendor_transactions")
      .select("id, type, amount, description, created_at")
      .eq("vendor_id", vendor.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("payouts")
      .select("id, amount, status, created_at")
      .eq("vendor_id", vendor.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <EarningsView
      balance={Number(vendor.balance)}
      transactions={(txnRes.data ?? []) as never}
      payouts={(payoutRes.data ?? []) as never}
    />
  );
}
