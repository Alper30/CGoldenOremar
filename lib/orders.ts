import { createSupabaseServerClient } from "./supabase/server";

// Alıcının siparişleri — satıcı kırılımı (order_vendors) + kalemler + mağaza adı.
// RLS sayesinde yalnızca kendi siparişleri döner.
export async function fetchMyOrders() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select(
      "*, order_vendors(*, order_items(*), vendor_profiles(name, slug))",
    )
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function fetchOrder(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select(
      "*, order_vendors(*, order_items(*), vendor_profiles(name, slug))",
    )
    .eq("id", id)
    .single();
  return data;
}

export type MyOrder = Awaited<ReturnType<typeof fetchMyOrders>>[number];
