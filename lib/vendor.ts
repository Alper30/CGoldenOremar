import { createSupabaseServerClient } from "./supabase/server";

// Geçerli kullanıcının satıcı profili (yoksa null). RLS: vendor_profiles public
// okunur; user_id eşleşmesiyle kendi kaydını alır.
export async function getMyVendor() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("vendor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  return data;
}
