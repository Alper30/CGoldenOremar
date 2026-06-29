import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ApplicationsManager } from "@/components/panel/ApplicationsManager";

export const metadata = { title: "Başvurular · Yönetim" };

export default async function AdminApplicationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("vendor_applications")
    .select(
      "id, store_name, person, tc_no, iban, phone, province, district, story, document_url, selfie_url, created_at",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return <ApplicationsManager applications={(data ?? []) as never} />;
}
