'use client'

import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartCard } from '@/components/admin/chart-card'
import { formatNumber } from '@/lib/admin/format'
import type { CategorySlice, OrderStatusSlice } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const PALETTE = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--info)',
]

function DonutTooltip({
  active,
  payload,
  total,
  unit,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>
  total: number
  unit: string
}) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  const pct = total ? ((p.value / total) * 100).toFixed(1) : '0'
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <div className="flex items-center gap-2">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: p.payload.fill }}
        />
        <span className="font-medium text-popover-foreground">{p.name}</span>
      </div>
      <p className="mt-1 text-muted-foreground">
        {formatNumber(p.value)} {unit} · %{pct}
      </p>
    </div>
  )
}

interface DonutProps<T> {
  title: string
  description: string
  data: T[]
  nameKey: keyof T & string
  unit: string
}

function Donut<T extends { value: number }>({
  title,
  description,
  data,
  nameKey,
  unit,
}: DonutProps<T>) {
  const [hidden, setHidden] = useState<Record<string, boolean>>({})
  const label = (d: T) => String(d[nameKey as keyof T])
  const visible = data.filter((d) => !hidden[label(d)])
  const total = visible.reduce((s, d) => s + Number(d.value), 0)

  return (
    <ChartCard title={title} description={description} contentClassName="pt-2">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={visible}
                dataKey="value"
                nameKey={nameKey}
                innerRadius={52}
                outerRadius={84}
                paddingAngle={2}
                stroke="var(--card)"
                strokeWidth={2}
                animationDuration={700}
              >
                {visible.map((entry, i) => {
                  const idx = data.findIndex(
                    (d) => label(d) === label(entry),
                  )
                  return (
                    <Cell
                      key={i}
                      fill={PALETTE[idx % PALETTE.length]}
                    />
                  )
                })}
              </Pie>
              <Tooltip
                content={<DonutTooltip total={total} unit={unit} />}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold">{formatNumber(total)}</span>
            <span className="text-[10px] text-muted-foreground">Toplam</span>
          </div>
        </div>

        <ul className="flex w-full flex-col gap-1.5">
          {data.map((d, i) => {
            const key = label(d)
            const isHidden = hidden[key]
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() =>
                    setHidden((h) => ({ ...h, [key]: !h[key] }))
                  }
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs transition-opacity hover:bg-muted',
                    isHidden && 'opacity-40',
                  )}
                >
                  <span
                    className="size-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="truncate text-foreground">{key}</span>
                  <span className="ml-auto font-semibold text-muted-foreground">
                    {formatNumber(Number(d.value))}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </ChartCard>
  )
}

export function CategoryDonut({ data }: { data: CategorySlice[] }) {
  return (
    <Donut
      title="Kategori Bazlı Satış"
      description="Satışların kategori dağılımı"
      data={data}
      nameKey="name"
      unit="satış"
    />
  )
}

export function OrderStatusDonut({ data }: { data: OrderStatusSlice[] }) {
  return (
    <Donut
      title="Sipariş Durumu Dağılımı"
      description="Aktif siparişlerin durumu"
      data={data}
      nameKey="status"
      unit="sipariş"
    />
  )
}
