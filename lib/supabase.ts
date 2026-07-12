import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ortam değişkenleri tanımlı mı? (Vercel'de eksikse build'i kilitlememek için
// kullanılır — eksikken katalog sorguları boş döner, hard-crash olmaz.)
export const supabaseConfigured = Boolean(url && anonKey);

if (!supabaseConfigured) {
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlı değil — katalog boş dönecek.",
  );
}

// Tek anon istemci — hem server hem client component'lerde kullanılabilir.
// Sadece herkese açık katalog okumaları için (RLS public-select); yazma/auth
// sonraki katmanda ayrı istemci/oturum ile gelir.
// Env eksikse geçerli-biçimli AMA çözümlenemeyen yer tutucu ile oluşturulur ki
// createClient module yükleme anında throw etmesin (aksi halde tüm route'ların
// build'i çöker). `.invalid` (RFC 2606) asla DNS'te çözülmez → istek dışarı
// sızamaz; üçüncü tarafa istek gitmez.
//
// KRİTİK: auth kapalı (persistSession/autoRefreshToken=false). Aksi halde bu
// istemci, ssr browser client ile AYNI `sb-<ref>-auth-token` deposunu ve
// GoTrueClient kilidini (navigator.locks) paylaşıp "Multiple GoTrueClient
// instances" çekişmesi yaratıyordu → authenticated .rpc() (ör. checkout
// create_order) kilidi bekleyip sonsuza dek asılı kalıyordu. Bu client yalnız
// anon okuma yapar, oturuma ihtiyacı yok → auth'u tamamen devre dışı bırak.
export const supabase = createClient<Database>(
  url ?? "https://placeholder.invalid",
  anonKey ?? "invalid-anon-key",
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);
