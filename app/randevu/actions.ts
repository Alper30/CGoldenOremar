"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notifyNewBooking } from "@/lib/notify";

// Randevu talebi SERVER ACTION ile kaydedilir: guarded create_booking() RPC
// (sunucu-tarafı doğrulama) + platform gelen kutusuna bildirim. İstemci
// değerlerine güvenilmez; asıl doğrulama RPC içinde tekrarlanır.

export type BookingInput = {
  experienceType: string;
  guests: number;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
};

type Result = { ok: true } | { error: string };

export async function submitBooking(input: BookingInput): Promise<Result> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.rpc("create_booking", {
    p_experience: input.experienceType,
    p_guests: input.guests,
    p_date: input.date,
    p_time: input.time,
    p_name: input.name,
    p_email: input.email,
    p_phone: input.phone,
    p_notes: input.notes ?? "",
  });

  if (error) {
    console.error("[randevu] create_booking hatası:", error.message);
    return { error: "Randevu kaydedilemedi. Lütfen bilgileri kontrol edip tekrar deneyin." };
  }

  // Bildirim best-effort — kayıt başarılıysa hata olsa da kullanıcıya başarı döner.
  await notifyNewBooking({
    experience_type: input.experienceType,
    guests: input.guests,
    booking_date: input.date,
    booking_time: input.time,
    name: input.name,
    email: input.email,
    phone: input.phone,
    notes: input.notes ?? null,
  });

  return { ok: true };
}
