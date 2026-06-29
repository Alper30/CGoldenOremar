'use client'

import { RANGE_LABELS } from '@/lib/admin/format'
import type { DateRangeKey } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const ORDER: DateRangeKey[] = ['today', '7d', '30d', 'month', 'custom']

export function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRangeKey
  onChange: (v: DateRangeKey) => void
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-1">
      {ORDER.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
            value === key
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          {RANGE_LABELS[key]}
        </button>
      ))}
    </div>
  )
}
