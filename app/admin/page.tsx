import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Dashboard } from "@/components/admin/dashboard/dashboard";
import { RANGE_DAYS } from "@/lib/admin/format";
import type { DashboardData, DateRangeKey } from "@/lib/admin/types";

export const metadata = { title: "Gösterge Paneli · Yönetim" };

const VALID: DateRangeKey[] = ["today", "7d", "30d", "month", "custom"];

// Veri SUNUCUDA çekilir (admin_dashboard RPC). Tarih aralığı ?g= query'sinden
// gelir → aralık değişince sunucu yeniden render eder. Server client kullanılır;
// tarayıcı Supabase istemcisi burada devrede değil (güvenli + güvenilir).
export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ g?: string }>;
}) {
  const { g } = await searchParams;
  const range: DateRangeKey = VALID.includes(g as DateRangeKey) ? (g as DateRangeKey) : "30d";

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("admin_dashboard", { p_days: RANGE_DAYS[range] });

  return (
    <Dashboard
      data={(data as unknown as DashboardData) ?? null}
      range={range}
      error={error?.message ?? null}
    />
  );
}
