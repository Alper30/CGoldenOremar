import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Tek anon istemci — hem server hem client component'lerde kullanılabilir.
// Sadece herkese açık katalog okumaları için (RLS public-select); yazma/auth
// sonraki katmanda ayrı istemci/oturum ile gelir.
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
