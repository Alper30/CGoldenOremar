"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { DashboardData, DateRangeKey } from "@/lib/admin/types";
import { RANGE_LABELS } from "@/lib/admin/format";
import { DateRangePicker } from "./date-range-picker";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { KpiCard } from "./kpi-card";
import { CommissionLineChart, OrderBarChart, RevenueAreaChart } from "./trend-charts";
import { CategoryDonut, OrderStatusDonut } from "./distribution-charts";
import { ActivityFeed, CityDistributionList, TopProducts, TopVendors } from "./dashboard-lists";

// Veri sunucudan prop olarak gelir (app/admin/page.tsx). Aralık değişince URL
// query'sini güncelleyip sunucuyu yeniden çalıştırırız (useTransition → geçişte
// skeleton). Tarayıcı Supabase istemcisi kullanılmaz.
export function Dashboard({
  data,
  range,
  error,
}: {
  data: DashboardData | null;
  range: DateRangeKey;
  error: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setRange(next: DateRangeKey) {
    startTransition(() => router.push(`/admin?g=${next}`, { scroll: false }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Platform genel görünümü · {RANGE_LABELS[range]}
        </p>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {error && !pending ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm font-medium text-destructive">
            Gösterge paneli verisi yüklenemedi
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => startTransition(() => router.refresh())}
            className="mt-4 inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Tekrar dene
          </button>
        </div>
      ) : pending || !data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {data.kpis.map((m) => (
              <KpiCard key={m.key} metric={m} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueAreaChart data={data.revenueTrend} />
            </div>
            <CategoryDonut data={data.categories} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <OrderBarChart data={data.revenueTrend} />
            </div>
            <OrderStatusDonut data={data.orderStatus} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TopProducts data={data.topProducts} />
            <TopVendors data={data.topVendors} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <CommissionLineChart data={data.revenueTrend} />
            <CityDistributionList data={data.cities} />
            <ActivityFeed data={data.activity} />
          </div>
        </>
      )}
    </div>
  );
}
