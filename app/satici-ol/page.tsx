import { getAuthSnapshot } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { VendorApplyForm } from "@/components/VendorApplyForm";

export const metadata = { title: "Satıcı Ol · Golden Oremar" };

export default async function VendorApplyPage() {
  const { user, profile } = await getAuthSnapshot();

  let application: { status: string; reject_reason: string | null } | null = null;
  if (user) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("vendor_applications")
      .select("status, reject_reason")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    application = data;
  }

  return (
    <VendorApplyForm
      signedIn={Boolean(user)}
      role={profile?.role ?? null}
      application={application}
      defaults={{ name: profile?.full_name ?? "", phone: profile?.phone ?? "" }}
    />
  );
}
