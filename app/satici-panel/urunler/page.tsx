import { getMyVendor } from "@/lib/vendor";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductManager } from "@/components/panel/ProductManager";

export const metadata = { title: "Ürünlerim · Golden Oremar" };

export default async function VendorProductsPage() {
  const vendor = await getMyVendor();
  if (!vendor) return null;

  const supabase = await createSupabaseServerClient();
  const [productsRes, catsRes] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, name, price, old_price, unit, image, region, badge, description, cold_chain, status, category_id",
      )
      .eq("vendor_id", vendor.id)
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("id, slug, name").order("sort_order"),
  ]);

  return (
    <ProductManager
      vendorId={vendor.id}
      products={(productsRes.data ?? []) as never}
      categories={(catsRes.data ?? []) as never}
    />
  );
}
