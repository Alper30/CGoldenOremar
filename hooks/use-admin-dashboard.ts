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

  useEffect(() => {
    let active = true;
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    supabase
      .rpc("admin_dashboard", { p_days: RANGE_DAYS[range] })
      .then(({ data: d, error }) => {
        if (!active) return;
        if (error) {
          console.error("[admin_dashboard]", error.message);
          setData(null);
        } else {
          setData(d as unknown as DashboardData);
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [range]);

  return { data, loading };
}
