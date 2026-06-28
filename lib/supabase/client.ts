import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../database.types";

// Tarayıcı (client component) istemcisi. Oturum çerezini localStorage yerine
// cookie üzerinden taşır; böylece sunucu da aynı oturumu görür.
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
