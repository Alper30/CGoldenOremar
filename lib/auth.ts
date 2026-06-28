import { createSupabaseServerClient } from "./supabase/server";
import type { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type AuthSnapshot = {
  user: { id: string; email: string | null } | null;
  profile: Profile | null;
};

// Sunucuda mevcut oturumu + profili döndürür. RSC / layout / Server Action'da
// kullanılır. getUser() token'ı Supabase'e doğrulatır (getSession'a göre güvenli).
export async function getAuthSnapshot(): Promise<AuthSnapshot> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    user: { id: user.id, email: user.email ?? null },
    profile: profile ?? null,
  };
}
