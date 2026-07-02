"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { RANGE_DAYS } from "@/lib/admin/format";
import type { DashboardData, DateRangeKey } from "@/lib/admin/types";

// admin_dashboard RPC'sini (yalnız admin) seçilen pencere için çağırır.
// Tüm hesap SUNUCUDA; istemci sadece JSON'ı render eder.
export function useAdminDashboard(range: DateRangeKey) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // retry: değeri artırınca effect yeniden çalışır (manuel "tekrar dene").
  const [retry, setRetry] = useState(0);

  // range/retry değişince yükleme durumunu sıfırla + RPC'yi yeniden çağır; setState
  // burada bilinçli (harici veriyle senkron) → projenin mount/fetch deseni.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    supabase
      .rpc("admin_dashboard", { p_days: RANGE_DAYS[range] })
      .then(({ data: d, error: rpcError }) => {
        if (!active) return;
        if (rpcError) {
          // Hata artık sessizce yutulmuyor: UI görünür bir hata + "tekrar dene"
          // gösterebilsin diye state'e yazılıyor (sonsuz skeleton tuzağını önler).
          console.error("[admin_dashboard]", rpcError.message);
          setData(null);
          setError(rpcError.message || "Gösterge paneli verisi alınamadı.");
        } else {
          setData(d as unknown as DashboardData);
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [range, retry]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return { data, loading, error, retry: () => setRetry((n) => n + 1) };
}
