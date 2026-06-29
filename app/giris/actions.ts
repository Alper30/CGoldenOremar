"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; info?: string };

// Supabase hata mesajlarını kullanıcı dostu Türkçe'ye çevir.
function mapError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "E-posta veya şifre hatalı.";
  if (m.includes("not confirmed") || m.includes("not been confirmed"))
    return "E-postanız henüz doğrulanmamış. Doğrulama bağlantısına tıklayın veya destekle iletişime geçin.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.";
  if (m.includes("password")) return "Şifre en az 6 karakter olmalı.";
  if (m.includes("email")) return "Geçerli bir e-posta girin.";
  return "Bir hata oluştu, lütfen tekrar deneyin.";
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "E-posta ve şifre gerekli." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: mapError(error.message) };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName) return { error: "Ad soyad gerekli." };
  if (!email || !password) return { error: "E-posta ve şifre gerekli." };
  if (password.length < 6) return { error: "Şifre en az 6 karakter olmalı." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone } },
  });
  if (error) return { error: mapError(error.message) };

  // E-posta doğrulaması açıksa oturum dönmez → kullanıcıyı bilgilendir.
  if (!data.session) {
    return {
      info: "Hesabınız oluşturuldu. E-postanıza gönderilen bağlantıyla doğrulama yapın.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
