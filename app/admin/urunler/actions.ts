"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Admin ürün CRUD'u SERVER ACTION'larla yapılır (server client). Tarayıcı Supabase
// istemcisi bu ortamda mutation'larda asıldığından (getSession zinciri) işlemler
// sunucuya taşındı — CLAUDE.md'nin "hesap/işlem sunucuda" ilkesiyle de uyumlu.
// Yetki RLS ile ("ürün: admin tam yetki" → private.is_admin()) zorlanır; admin
// olmayan çağrı hata döner.

type Result = { ok: true } | { error: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ığüşöçİ]/g, (c) => ({ ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c", İ: "i" })[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const ALLOWED = ["draft", "pending", "published", "rejected"] as const;

export async function setProductStatus(id: string, status: string): Promise<Result> {
  if (!ALLOWED.includes(status as (typeof ALLOWED)[number])) return { error: "Geçersiz durum." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/urunler");
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<Result> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/urunler");
  return { ok: true };
}

export async function saveProduct(formData: FormData): Promise<Result> {
  const supabase = await createSupabaseServerClient();

  const id = (formData.get("id") as string) || null;
  const vendor_id = formData.get("vendor_id") as string;
  const category_id = formData.get("category_id") as string;
  const name = ((formData.get("name") as string) || "").trim();
  const status = (formData.get("status") as string) || "published";

  if (!vendor_id) return { error: "Satıcı seçilmedi." };
  if (!category_id) return { error: "Kategori seçilmedi." };
  if (!name) return { error: "Ürün adı boş olamaz." };
  if (!ALLOWED.includes(status as (typeof ALLOWED)[number])) return { error: "Geçersiz durum." };

  const num = (k: string) => {
    const v = formData.get(k) as string;
    return v ? Number(v) : null;
  };

  let image = (formData.get("keepImage") as string) || null;
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    // Görsel atanan satıcının klasörüne yüklenir (sahiplik tutarlı; migration 0025
    // ile admin storage insert/update izni var).
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${vendor_id}/${Date.now()}.${ext}`;
    const up = await supabase.storage.from("products").upload(path, file, { upsert: true });
    if (up.error) return { error: `Görsel yüklenemedi: ${up.error.message}` };
    image = supabase.storage.from("products").getPublicUrl(path).data.publicUrl;
  }

  const payload = {
    name,
    vendor_id,
    category_id,
    status,
    price: num("price") ?? 0,
    old_price: num("old_price"),
    unit: (formData.get("unit") as string) || "",
    stock: num("stock") ?? 0,
    region: (formData.get("region") as string) || null,
    badge: (formData.get("badge") as string) || null,
    description: (formData.get("description") as string) || null,
    cold_chain: formData.get("cold_chain") === "true",
    image,
  };

  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("products").insert({
      ...payload,
      slug: `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`,
    });
    if (error) return { error: error.message };
  }
  revalidatePath("/admin/urunler");
  return { ok: true };
}
