"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Admin satıcı yönetimi — guarded RPC (private.is_admin()). Verify: KYC güven
// rozeti; suspend: askıya alınca yayındaki ürünler vitrinden çekilir (RPC içinde).

type Result = { ok: true } | { error: string };

function humanize(msg: string): string {
  if (msg.includes("not_authorized")) return "Bu işlem için yetkiniz yok.";
  return msg;
}

export async function setVendorVerified(vendorId: string, verified: boolean): Promise<Result> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_set_vendor_verified", {
    p_vendor: vendorId,
    p_verified: verified,
  });
  if (error) return { error: humanize(error.message) };
  revalidatePath("/admin/saticilar");
  return { ok: true };
}

export async function setVendorSuspended(vendorId: string, suspended: boolean): Promise<Result> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_set_vendor_suspended", {
    p_vendor: vendorId,
    p_suspended: suspended,
  });
  if (error) return { error: humanize(error.message) };
  revalidatePath("/admin/saticilar");
  return { ok: true };
}
