import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminOrders } from "@/components/panel/AdminOrders";

export const metadata = { title: "Siparişler · Yönetim" };

export default async function AdminOrdersPage() {
  const supabase = await createSupabaseServerClient();
  const [disputedRes, recentRes] = await Promise.all([
    supabase
      .from("order_vendors")
      .select("id, items_subtotal, net_amount, vendor_profiles(name), order_items(name, qty)")
      .eq("escrow_status", "disputed")
      .order("created_at", { ascending: true }),
    supabase
      .from("orders")
      .select("id, grand_total, payment_status, created_at")
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  return (
    <AdminOrders
      disputed={(disputedRes.data ?? []) as never}
      recent={(recentRes.data ?? []) as never}
    />
  );
}
