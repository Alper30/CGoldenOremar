import type { DateRangeKey } from "./types";

export const RANGE_LABELS: Record<DateRangeKey, string> = {
  today: "Bugün",
  "7d": "Son 7 gün",
  "30d": "Son 30 gün",
  month: "Bu ay",
  custom: "Özel aralık",
};

// Tarih aralığı → gün sayısı (RPC penceresi).
export const RANGE_DAYS: Record<DateRangeKey, number> = {
  today: 1,
  "7d": 7,
  "30d": 30,
  month: 30,
  custom: 90,
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("tr-TR").format(value);
}
