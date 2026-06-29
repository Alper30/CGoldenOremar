export type DateRangeKey = "today" | "7d" | "30d" | "month" | "custom";

export type TrendPoint = { date: string; value: number };

export interface KpiMetric {
  key: string;
  label: string;
  value: number;
  /** önceki döneme göre yüzde değişim */
  change: number;
  format: "currency" | "number";
  spark: number[];
  tone: "primary" | "gold" | "info" | "warning";
}

export interface RevenuePoint {
  date: string;
  ciro: number;
  komisyon: number;
  siparis: number;
}

export interface CategorySlice {
  name: string;
  value: number;
}

export interface TopProduct {
  id: string;
  name: string;
  vendor: string;
  category: string;
  sold: number;
  revenue: number;
}

export interface TopVendor {
  id: string;
  name: string;
  city: string;
  revenue: number;
  orders: number;
  rating: number;
}

export interface OrderStatusSlice {
  status: string;
  value: number;
}

export interface CityDistribution {
  city: string;
  orders: number;
  revenue: number;
}

export type ActivityType = "order" | "application" | "user" | "product" | "payout";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  /** kaç dakika önce */
  ago: number;
}

export interface DashboardData {
  kpis: KpiMetric[];
  revenueTrend: RevenuePoint[];
  categories: CategorySlice[];
  topProducts: TopProduct[];
  topVendors: TopVendor[];
  orderStatus: OrderStatusSlice[];
  cities: CityDistribution[];
  activity: ActivityItem[];
}
