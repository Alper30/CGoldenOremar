import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

// SERVICE-ROLE istemcisi — RLS'i atlar, YALNIZCA sunucuda (webhook gibi oturumsuz
// bağlamlarda) kullanılır. Anahtar yoksa null → çağıran taraf bunu ele almalı.
// service_role anahtarı ASLA istemciye sızdırılmaz (server-only + NEXT_PUBLIC değil).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdminEnabled = Boolean(url && serviceKey);

export function createSupabaseAdminClient() {
  if (!url || !serviceKey) return null;
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
