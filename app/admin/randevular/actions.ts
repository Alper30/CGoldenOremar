"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Randevu durumu güncelleme — yetki RLS ("randevu: admin günceller" →
// private.is_admin()) ile zorlanır; admin olmayan çağrı satır bulamaz.

const ALLOWED = ["new", "confirmed", "cancelled", "done"] as const;

type Result = { ok: true } | { error: string };

export async function setBookingStatus(id: string, status: string): Promise<Result> {
  if (!ALLOWED.includes(status as (typeof ALLOWED)[number])) return { error: "Geçersiz durum." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/randevular");
  return { ok: true };
}
