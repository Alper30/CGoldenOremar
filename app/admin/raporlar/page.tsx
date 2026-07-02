import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ReportsView,
  type ReportOrderVendor,
  type ReportPayout,
  type ReportTxn,
} from "@/components/admin/ReportsView";

export const metadata = { title: "Raporlar · Yönetim" };

// Satış/komisyon/satıcı performans raporları + CSV dışa aktarım.
// Veri admin oturumuyla okunur (0011 admin read policies); toplama istemcide.
export default async function AdminReportsPage() {
  const supabase = await createSupabaseServerClient();
  const [ovRes, payoutRes, txnRes] = await Promise.all([
    supabase
      .from("order_vendors")
      .select(
        "id, created_at, escrow_status, items_subtotal, shipping_fee, commission_amount, net_amount, vendor_profiles(name)",
      )
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase
      .from("payouts")
      .select("id, amount, status, created_at, processed_at, vendor_profiles(name)")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("vendor_transactions")
      .select("id, type, amount, description, created_at, vendor_profiles(name)")
      .order("created_at", { ascending: false })
      .limit(1000),
  ]);

  return (
    <ReportsView
      orderVendors={(ovRes.data ?? []) as unknown as ReportOrderVendor[]}
      payouts={(payoutRes.data ?? []) as unknown as ReportPayout[]}
      txns={(txnRes.data ?? []) as unknown as ReportTxn[]}
    />
  );
}
