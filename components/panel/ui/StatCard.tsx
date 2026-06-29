"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { fmtPrice } from "@/lib/data";
import { CHART_COLORS } from "@/lib/admin/mock";

export function StatCard({
  label,
  value,
  deltaPct,
  spark,
  money,
}: {
  label: string;
  value: number;
  deltaPct: number;
  spark: number[];
  money?: boolean;
}) {
  const up = deltaPct > 0;
  const flat = deltaPct === 0;
  const data = spark.map((v, i) => ({ i, v }));
  const gid = `spark-${label.replace(/\s+/g, "")}`;

  return (
    <div className="group rounded-2xl border border-line bg-card p-4 shadow-[0_1px_0_rgba(20,14,2,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-22px_rgba(31,39,28,0.5)]">
      <p className="text-xs font-medium text-muted">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="font-display text-2xl leading-none text-forest-deep">
          {money
            ? fmtPrice(value)
            : value.toLocaleString("tr-TR")}
        </p>
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
            flat
              ? "bg-line/60 text-muted"
              : up
                ? "bg-success/12 text-success"
                : "bg-red-100 text-red-600"
          }`}
        >
          {!flat && (
            <svg viewBox="0 0 24 24" className={`h-3 w-3 ${up ? "" : "rotate-180"}`} fill="none" stroke="currentColor" strokeWidth={3}>
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          %{Math.abs(deltaPct).toLocaleString("tr-TR")}
        </span>
      </div>
      <div className="mt-2 h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={up || flat ? CHART_COLORS.gold : "#dc2626"} stopOpacity={0.35} />
                <stop offset="100%" stopColor={up || flat ? CHART_COLORS.gold : "#dc2626"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={up || flat ? CHART_COLORS.gold : "#dc2626"}
              strokeWidth={2}
              fill={`url(#${gid})`}
              isAnimationActive
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
