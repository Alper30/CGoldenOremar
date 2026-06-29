'use client'

import {
  Bell,
  FileCheck2,
  PackageSearch,
  ShoppingCart,
  Star,
  UserPlus,
  Wallet,
} from 'lucide-react'
import { ChartCard } from '@/components/admin/chart-card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatNumber } from '@/lib/admin/format'
import type {
  ActivityItem,
  ActivityType,
  CityDistribution,
  TopProduct,
  TopVendor,
} from '@/lib/admin/types'

export function TopProducts({ data }: { data: TopProduct[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1)
  return (
    <ChartCard
      title="En Çok Satan Ürünler"
      description="Ciroya göre ilk ürünler"
    >
      <ul className="flex flex-col gap-3">
        {data.map((p, i) => (
          <li key={p.id} className="flex items-center gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <span className="shrink-0 text-xs font-semibold">
                  {formatCurrency(p.revenue)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(p.revenue / max) * 100}%` }}
                  />
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatNumber(p.sold)} adet
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}

export function TopVendors({ data }: { data: TopVendor[] }) {
  return (
    <ChartCard
      title="En İyi Satıcılar"
      description="Ciroya göre sıralı"
    >
      <ul className="flex flex-col divide-y divide-border">
        {data.map((v, i) => (
          <li key={v.id} className="flex items-center gap-3 py-2.5 first:pt-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-xs font-bold text-gold">
              {v.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{v.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {v.city} · {formatNumber(v.orders)} sipariş
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{formatCurrency(v.revenue)}</p>
              <p className="flex items-center justify-end gap-0.5 text-xs text-muted-foreground">
                <Star className="size-3 fill-gold text-gold" />
                {v.rating.toFixed(1)}
              </p>
            </div>
            {i === 0 && <Badge variant="gold">Lider</Badge>}
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}

export function CityDistributionList({ data }: { data: CityDistribution[] }) {
  const max = Math.max(...data.map((d) => d.orders), 1)
  return (
    <ChartCard
      title="Coğrafi Dağılım"
      description="İl bazlı sipariş yoğunluğu"
    >
      <ul className="flex flex-col gap-2.5">
        {data.map((c) => (
          <li key={c.city} className="flex items-center gap-3">
            <span className="w-20 shrink-0 truncate text-sm">{c.city}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-info"
                style={{ width: `${(c.orders / max) * 100}%` }}
              />
            </div>
            <span className="w-12 shrink-0 text-right text-xs font-semibold">
              {formatNumber(c.orders)}
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}

const ACTIVITY_ICON: Record<
  ActivityType,
  { icon: typeof ShoppingCart; tone: string }
> = {
  order: { icon: ShoppingCart, tone: 'bg-primary/15 text-primary' },
  application: { icon: FileCheck2, tone: 'bg-info/15 text-info' },
  user: { icon: UserPlus, tone: 'bg-gold/15 text-gold' },
  product: { icon: PackageSearch, tone: 'bg-warning/15 text-warning' },
  payout: { icon: Wallet, tone: 'bg-success/15 text-success' },
}

function agoLabel(min: number) {
  if (min < 60) return `${min} dk önce`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} sa önce`
  return `${Math.floor(h / 24)} gün önce`
}

export function ActivityFeed({ data }: { data: ActivityItem[] }) {
  return (
    <ChartCard
      title="Son Aktiviteler"
      description="Canlı platform akışı"
      action={
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Canlı
        </span>
      }
    >
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <Bell className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Henüz aktivite yok</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.map((a) => {
            const cfg = ACTIVITY_ICON[a.type]
            const Icon = cfg.icon
            return (
              <li key={a.id} className="flex items-start gap-3">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${cfg.tone}`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.detail}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {agoLabel(a.ago)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </ChartCard>
  )
}
