'use client'

import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/admin/format'
import type { KpiMetric } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const TONE: Record<KpiMetric['tone'], { dot: string; spark: string }> = {
  primary: { dot: 'bg-primary', spark: 'var(--primary)' },
  gold: { dot: 'bg-gold', spark: 'var(--gold)' },
  info: { dot: 'bg-info', spark: 'var(--info)' },
  warning: { dot: 'bg-warning', spark: 'var(--warning)' },
}

export function KpiCard({ metric }: { metric: KpiMetric }) {
  const tone = TONE[metric.tone]
  const positive = metric.change >= 0
  const value =
    metric.format === 'currency'
      ? formatCurrency(metric.value)
      : formatNumber(metric.value)
  const data = metric.spark.map((v, i) => ({ i, v }))
  const gradId = `spark-${metric.key}`

  return (
    <Card className="gap-0 p-4 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2">
        <span className={cn('size-2 rounded-full', tone.dot)} />
        <p className="truncate text-xs font-medium text-muted-foreground">
          {metric.label}
        </p>
      </div>

      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xl font-bold tracking-tight">{value}</p>
          <div className="mt-1 flex items-center gap-1">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-semibold',
                positive ? 'text-success' : 'text-destructive',
              )}
            >
              {positive ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {Math.abs(metric.change).toFixed(1)}%
            </span>
            <span className="text-[10px] text-muted-foreground">
              önceki döneme göre
            </span>
          </div>
        </div>

        <div className="h-10 w-20 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 2, bottom: 2 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tone.spark} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={tone.spark} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={tone.spark}
                strokeWidth={2}
                fill={`url(#${gradId})`}
                isAnimationActive={false}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
