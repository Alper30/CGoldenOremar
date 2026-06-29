"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "../store";
import { fmtPrice } from "@/lib/data";

type Daily = { day: string; orders: number; revenue: number };
export type Stats = {
  orders_total: number;
  orders_paid: number;
  revenue_total: number;
  commission_total: number;
  vendors_total: number;
  users_total: number;
  pending_applications: number;
  pending_products: number;
  pending_payouts: number;
  daily: Daily[];
};

const shortDay = (d: string) => d.slice(8) + "/" + d.slice(5, 7);

export function AdminDashboard({ stats }: { stats: Stats }) {
  const { t } = useStore();
  const daily = (stats.daily ?? []).map((d) => ({ ...d, label: shortDay(d.day) }));

  const cards = [
    { label: t("adRevenue"), value: fmtPrice(Number(stats.revenue_total ?? 0)), accent: true },
    { label: t("adCommission"), value: fmtPrice(Number(stats.commission_total ?? 0)), accent: true },
    { label: t("adOrdersCount"), value: String(stats.orders_total ?? 0) },
    { label: t("adVendorsCount"), value: String(stats.vendors_total ?? 0) },
    { label: t("adUsersCount"), value: String(stats.users_total ?? 0) },
    { label: t("adPendingApps"), value: String(stats.pending_applications ?? 0) },
    { label: t("adPendingProducts"), value: String(stats.pending_products ?? 0) },
    { label: t("adPendingPayouts"), value: String(stats.pending_payouts ?? 0) },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-deep sm:text-3xl">{t("adDashboard")}</h1>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl border p-4 ${
              c.accent ? "border-gold/40 bg-amber-bg" : "border-line bg-card"
            }`}
          >
            <p className="text-xs font-medium text-muted">{c.label}</p>
            <p className="mt-1 font-display text-2xl text-forest-deep">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-forest-deep">{t("adChartRevenue")}</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={daily} margin={{ left: -10, right: 8, top: 4 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A961" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#C9A961" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={1} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v) => fmtPrice(Number(v))}
                contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#C9A961" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-forest-deep">{t("adChartOrders")}</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={daily} margin={{ left: -10, right: 8, top: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={1} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              <Bar dataKey="orders" fill="#1f4d3a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
