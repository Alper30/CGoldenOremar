import { getMyVendor } from "@/lib/vendor";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { VendorDashboard } from "@/components/panel/VendorDashboard";

export const metadata = { title: "Satıcı Paneli · Golden Oremar" };

export default async function VendorPanelHome() {
  const vendor = await getMyVendor();
  if (!vendor) return null;

  const supabase = await createSupabaseServerClient();
  const [pendingRes, publishedRes, recentRes] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendor.id)
      .eq("status", "pending"),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendor.id)
      .eq("status", "published"),
    supabase
      .from("order_vendors")
      .select("id, escrow_status, net_amount, created_at, order_items(name, qty)")
      .eq("vendor_id", vendor.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <VendorDashboard
      vendor={vendor}
      pending={pendingRes.count ?? 0}
      published={publishedRes.count ?? 0}
      recent={(recentRes.data ?? []) as never}
    />
  );
}
