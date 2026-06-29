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
  // Env eksikse / Supabase erişilemezse oturumsuz kabul et — layout bunu await
  // ettiğinden fırlatmak tüm siteyi düşürür.
  try {
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
  } catch (e) {
    // Fail-SAFE: hata durumunda "oturumsuz" döneriz. Bu yetki VERMEZ —
    // korumalı route guard'ları (admin/satıcı layout) null görünce login'e
    // yönlendirir (erişim reddi). Hata fırlatmak ise layout'u await eden tüm
    // siteyi düşürür; bu yüzden bilinçli olarak yutuluyor.
    console.error("[auth] oturum alınamadı, oturumsuz kabul ediliyor:", e);
    return { user: null, profile: null };
  }
}
