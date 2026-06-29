import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductModeration } from "@/components/panel/ProductModeration";

export const metadata = { title: "Ürün Moderasyonu · Yönetim" };

export default async function AdminProductsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, price, image, region, vendor_profiles(name), categories(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return <ProductModeration products={(data ?? []) as never} />;
}
