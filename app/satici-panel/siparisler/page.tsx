import { getMyVendor } from "@/lib/vendor";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { VendorOrders, type OV } from "@/components/panel/VendorOrders";

export const metadata = { title: "Siparişler · Golden Oremar" };

export default async function VendorOrdersPage() {
  const vendor = await getMyVendor();
  if (!vendor) return null;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("order_vendors")
    .select(
      "id, escrow_status, items_subtotal, net_amount, tracking_no, tracking_carrier, created_at, order_items(name, qty), orders(ship_name, ship_line, ship_district, ship_province)",
    )
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  return <VendorOrders orders={(data ?? []) as unknown as OV[]} />;
}
