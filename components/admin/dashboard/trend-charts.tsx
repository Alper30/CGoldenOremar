'use client'

import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartCard, ChartTooltip } from '@/components/admin/chart-card'
import { formatCurrency, formatNumber } from '@/lib/admin/format'
import type { RevenuePoint } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const axisProps = {
  stroke: 'var(--muted-foreground)',
  fontSize: 11,
  tickLine: false,
  axisLine: false,
}

function compactCurrency(v: number) {
  if (v >= 1000) return `₺${Math.round(v / 1000)}k`
  return `₺${v}`
}

interface LegendToggleProps {
  series: { key: string; label: string; color: string }[]
  hidden: Record<string, boolean>
  onToggle: (key: string) => void
}

function LegendToggle({ series, hidden, onToggle }: LegendToggleProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {series.map((s) => (
        <button
          key={s.key}
          type="button"
          onClick={() => onToggle(s.key)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-opacity',
            hidden[s.key] ? 'opacity-40' : 'opacity-100',
          )}
        >
          <span
            className="size-2.5 rounded-sm"
            style={{ backgroundColor: s.color }}
          />
          {s.label}
        </button>
      ))}
    </div>
  )
}

export function RevenueAreaChart({ data }: { data: RevenuePoint[] }) {
  const [hidden, setHidden] = useState<Record<string, boolean>>({})
  const toggle = (k: string) =>
    setHidden((h) => ({ ...h, [k]: !h[k] }))

  const series = [
    { key: 'ciro', label: 'Ciro', color: 'var(--chart-1)' },
    { key: 'komisyon', label: 'Komisyon', color: 'var(--chart-2)' },
  ]

  return (
    <ChartCard
      title="Ciro Trendi"
      description="Seçili dönemde günlük ciro ve komisyon"
      action={
        <LegendToggle series={series} hidden={hidden} onToggle={toggle} />
      }
      contentClassName="h-72"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -8, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="ciroFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="komFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis dataKey="date" {...axisProps} minTickGap={24} />
          <YAxis {...axisProps} tickFormatter={compactCurrency} width={48} />
          <Tooltip
            content={<ChartTooltip formatter={formatCurrency} />}
            cursor={{ stroke: 'var(--border)' }}
          />
          {!hidden.ciro && (
            <Area
              type="monotone"
              name="Ciro"
              dataKey="ciro"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#ciroFill)"
              animationDuration={700}
            />
          )}
          {!hidden.komisyon && (
            <Area
              type="monotone"
              name="Komisyon"
              dataKey="komisyon"
              stroke="var(--chart-2)"
              strokeWidth={2.5}
              fill="url(#komFill)"
              animationDuration={700}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function OrderBarChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ChartCard
      title="Sipariş Trendi"
      description="Günlük sipariş adedi"
      contentClassName="h-72"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis dataKey="date" {...axisProps} minTickGap={24} />
          <YAxis {...axisProps} width={40} />
          <Tooltip
            content={<ChartTooltip formatter={formatNumber} />}
            cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
          />
          <Bar
            name="Sipariş"
            dataKey="siparis"
            fill="var(--chart-3)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            animationDuration={700}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function CommissionLineChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ChartCard
      title="Komisyon Geliri Trendi"
      description="Platform komisyon kazancı"
      contentClassName="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -8, right: 8, top: 8 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis dataKey="date" {...axisProps} minTickGap={24} />
          <YAxis {...axisProps} tickFormatter={compactCurrency} width={48} />
          <Tooltip
            content={<ChartTooltip formatter={formatCurrency} />}
            cursor={{ stroke: 'var(--border)' }}
          />
          <Line
            type="monotone"
            name="Komisyon"
            dataKey="komisyon"
            stroke="var(--gold)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
            animationDuration={700}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
