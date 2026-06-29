"use client";

import { useState } from "react";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";
import type { DateRangeKey } from "@/lib/admin/types";
import { RANGE_LABELS } from "@/lib/admin/format";
import { DateRangePicker } from "./date-range-picker";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { KpiCard } from "./kpi-card";
import { CommissionLineChart, OrderBarChart, RevenueAreaChart } from "./trend-charts";
import { CategoryDonut, OrderStatusDonut } from "./distribution-charts";
import { ActivityFeed, CityDistributionList, TopProducts, TopVendors } from "./dashboard-lists";

export function Dashboard() {
  const [range, setRange] = useState<DateRangeKey>("30d");
  const { data, loading } = useAdminDashboard(range);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Platform genel görünümü · {RANGE_LABELS[range]}
        </p>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {loading || !data ? (
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
