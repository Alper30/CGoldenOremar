import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../database.types";

// Tarayıcı (client component) istemcisi. Oturum çerezini localStorage yerine
// cookie üzerinden taşır; böylece sunucu da aynı oturumu görür.
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    // `.invalid` (RFC 2606) çözümlenemez → env yokken kimlik bilgisi dışarı sızmaz.
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.invalid",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "invalid-anon-key",
  );
}
