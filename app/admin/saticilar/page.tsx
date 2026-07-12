import { createSupabaseServerClient } from "@/lib/supabase/server";
import { VendorsTable, type AdminVendor } from "@/components/admin/VendorsTable";

export const metadata = { title: "Satıcılar · Yönetim" };

export default async function AdminVendorsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: vendors } = await supabase
    .from("vendor_profiles")
    .select("id, name, person, location, balance, rating, units_sold, verified, suspended")
    .order("created_at", { ascending: false });

  return <VendorsTable vendors={(vendors ?? []) as unknown as AdminVendor[]} />;
}
