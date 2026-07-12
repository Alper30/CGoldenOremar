"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Admin kullanıcı yönetimi. Yetki guarded RPC (private.is_admin()) ile zorlanır.
// Askıya alma ayrıca auth katmanında gerçek login ban'ı uygular (service-role).

const ROLES = ["user", "vendor", "admin"] as const;
type Result = { ok: true } | { error: string };

function humanize(msg: string): string {
  if (msg.includes("cannot_demote_self")) return "Kendi yönetici yetkinizi kaldıramazsınız.";
  if (msg.includes("cannot_suspend_self")) return "Kendinizi askıya alamazsınız.";
  if (msg.includes("not_authorized")) return "Bu işlem için yetkiniz yok.";
  return msg;
}

export async function setUserRole(userId: string, role: string): Promise<Result> {
  if (!ROLES.includes(role as (typeof ROLES)[number])) return { error: "Geçersiz rol." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_set_user_role", {
    p_user: userId,
    p_role: role as (typeof ROLES)[number],
  });
  if (error) return { error: humanize(error.message) };
  revalidatePath("/admin/kullanicilar");
  return { ok: true };
}

export async function setUserSuspended(userId: string, suspended: boolean): Promise<Result> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_set_user_suspended", {
    p_user: userId,
    p_suspended: suspended,
  });
  if (error) return { error: humanize(error.message) };

  // Gerçek login engeli: auth katmanında ban uygula/kaldır. Service-role yoksa
  // (yerelde) bayrak yine de set edilir; ban best-effort.
  const admin = createSupabaseAdminClient();
  if (admin) {
    const { error: banErr } = await admin.auth.admin.updateUserById(userId, {
      ban_duration: suspended ? "876000h" : "none",
    });
    if (banErr) console.error("[admin] kullanıcı ban hatası:", banErr.message);
  }

  revalidatePath("/admin/kullanicilar");
  return { ok: true };
}
