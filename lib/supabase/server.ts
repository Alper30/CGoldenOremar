import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "../database.types";

// Sunucu tarafı (RSC, Route Handler, Server Action) istemcisi.
// Oturum çerezini okur; yazma yalnızca Server Action/Route Handler'da mümkün
// (RSC'den set çağrısı sessizce yutulur — token'ı middleware tazeler).
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component'ten çağrıldı: oturum tazeleme middleware'de yapılır.
          }
        },
      },
    },
  );
}
