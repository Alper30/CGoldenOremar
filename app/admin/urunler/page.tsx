import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminProductManager, type AdminProduct } from "@/components/admin/AdminProductManager";

export const metadata = { title: "Ürün Yönetimi · Yönetim" };

// Admin tüm ürünleri görür (RLS: "ürün: satıcı/admin kendi görür" → is_admin).
export default async function AdminProductsPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: products }, { data: vendors }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, name, price, old_price, unit, stock, image, region, badge, description, cold_chain, status, category_id, vendor_id, vendor_profiles(name), categories(name)",
      )
      .order("created_at", { ascending: false }),
    supabase.from("vendor_profiles").select("id, name").order("name"),
    supabase.from("categories").select("id, slug, name").order("sort_order"),
  ]);

  return (
    <AdminProductManager
      products={(products ?? []) as unknown as AdminProduct[]}
      vendors={vendors ?? []}
      categories={categories ?? []}
    />
  );
}
