// Admin paneli için örnek (mock) veri katmanı.
// Amaç: gerçek Supabase verisi boş/eksikken paneli dolu ve test edilebilir
// göstermek. Gerçek veriye geçişte aynı tipler kullanılır; sayfalar veriyi
// Supabase'den çekip bu tiplere map'ler, mock'a düşmek opsiyonel fallback olur.
//
// NOT: Tüm değerler SABİT (Math.random YOK) — SSR/CSR hidrasyon uyuşmazlığını
// önlemek için deterministik tutuldu.

export type Kpi = {
  key: string;
  label: string;
  value: number;
  deltaPct: number; // önceki döneme göre % değişim
  spark: number[]; // mini trend
  money?: boolean;
};

export type SeriesPoint = { label: string; value: number };
export type Slice = { name: string; value: number; color: string };
export type TopProduct = { name: string; vendor: string; sold: number; revenue: number };
export type TopVendor = { name: string; location: string; revenue: number; orders: number };
export type GeoRow = { province: string; orders: number; revenue: number };
export type Activity = {
  kind: "order" | "application" | "signup" | "payout";
  text: string;
  at: string;
};

// Marka paleti (globals.css ile uyumlu)
export const CHART_COLORS = {
  gold: "#a8781f",
  goldSoft: "#d8b25e",
  forest: "#2e3a2b",
  forestSoft: "#5b6b54",
  success: "#3f6b43",
  amber: "#c9a227",
  clay: "#b06a3b",
  muted: "#6f6757",
};

const PIE = [
  CHART_COLORS.gold,
  CHART_COLORS.forest,
  CHART_COLORS.success,
  CHART_COLORS.goldSoft,
  CHART_COLORS.clay,
  CHART_COLORS.forestSoft,
];

export const mockKpis: Kpi[] = [
  { key: "revenue", label: "Toplam Ciro", value: 184250, deltaPct: 12.4, money: true, spark: [9, 11, 10, 13, 12, 15, 17, 16, 18, 21] },
  { key: "commission", label: "Toplam Komisyon", value: 14740, deltaPct: 11.8, money: true, spark: [7, 8, 8, 9, 10, 11, 11, 12, 13, 15] },
  { key: "orders", label: "Sipariş Sayısı", value: 1284, deltaPct: 8.1, spark: [40, 52, 49, 61, 58, 70, 66, 74, 80, 92] },
  { key: "vendors", label: "Aktif Satıcı", value: 6, deltaPct: 20, spark: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6] },
  { key: "users", label: "Kullanıcı", value: 312, deltaPct: 6.5, spark: [120, 150, 170, 190, 210, 235, 260, 280, 300, 312] },
  { key: "pendingApps", label: "Bekleyen Başvuru", value: 3, deltaPct: -25, spark: [6, 5, 5, 4, 4, 4, 3, 3, 3, 3] },
  { key: "pendingProducts", label: "Bekleyen Ürün", value: 5, deltaPct: 25, spark: [2, 3, 3, 4, 4, 4, 5, 5, 5, 5] },
  { key: "pendingPayouts", label: "Bekleyen Ödeme", value: 2, deltaPct: 0, money: false, spark: [1, 1, 2, 2, 2, 2, 2, 2, 2, 2] },
];

export const mockRevenueSeries: SeriesPoint[] = [
  { label: "1 Haz", value: 8200 }, { label: "3 Haz", value: 9100 },
  { label: "5 Haz", value: 7600 }, { label: "7 Haz", value: 11200 },
  { label: "9 Haz", value: 10400 }, { label: "11 Haz", value: 13800 },
  { label: "13 Haz", value: 12600 }, { label: "15 Haz", value: 15200 },
  { label: "17 Haz", value: 14100 }, { label: "19 Haz", value: 16900 },
  { label: "21 Haz", value: 15800 }, { label: "23 Haz", value: 18400 },
  { label: "25 Haz", value: 17500 }, { label: "27 Haz", value: 21000 },
];

export const mockOrdersSeries: SeriesPoint[] = [
  { label: "1 Haz", value: 42 }, { label: "3 Haz", value: 55 },
  { label: "5 Haz", value: 38 }, { label: "7 Haz", value: 71 },
  { label: "9 Haz", value: 64 }, { label: "11 Haz", value: 83 },
  { label: "13 Haz", value: 77 }, { label: "15 Haz", value: 96 },
  { label: "17 Haz", value: 88 }, { label: "19 Haz", value: 104 },
  { label: "21 Haz", value: 97 }, { label: "23 Haz", value: 118 },
  { label: "25 Haz", value: 109 }, { label: "27 Haz", value: 132 },
];

export const mockCommissionSeries: SeriesPoint[] = mockRevenueSeries.map((p) => ({
  label: p.label,
  value: Math.round(p.value * 0.08),
}));

export const mockCategorySplit: Slice[] = [
  { name: "Bal", value: 38, color: PIE[0] },
  { name: "Süt Ürünleri", value: 22, color: PIE[1] },
  { name: "Zeytin & Zeytinyağı", value: 18, color: PIE[2] },
  { name: "Reçel & Pekmez", value: 12, color: PIE[3] },
  { name: "Yumurta", value: 6, color: PIE[4] },
  { name: "Yöre Lezzetleri", value: 4, color: PIE[5] },
];

export const mockOrderStatus: Slice[] = [
  { name: "Yeni", value: 14, color: CHART_COLORS.goldSoft },
  { name: "Hazırlanıyor", value: 9, color: CHART_COLORS.amber },
  { name: "Kargoda", value: 21, color: CHART_COLORS.gold },
  { name: "Teslim", value: 48, color: CHART_COLORS.success },
  { name: "İade", value: 3, color: CHART_COLORS.clay },
  { name: "İptal", value: 5, color: CHART_COLORS.muted },
];

export const mockTopProducts: TopProduct[] = [
  { name: "Karakovan Çam Balı 850g", vendor: "Karadeniz Arıcılık", sold: 412, revenue: 61800 },
  { name: "Sızma Zeytinyağı 1L", vendor: "Ege Bahçeleri", sold: 286, revenue: 42900 },
  { name: "Köy Tulum Peyniri 1kg", vendor: "Merez Hatun", sold: 198, revenue: 35640 },
  { name: "Saf Yayık Tereyağı 500g", vendor: "Naciye'nin Mandırası", sold: 174, revenue: 26100 },
  { name: "Kuşburnu Reçeli 380g", vendor: "Yayla Lezzetleri", sold: 152, revenue: 13680 },
];

export const mockTopVendors: TopVendor[] = [
  { name: "Karadeniz Arıcılık", location: "Trabzon", revenue: 61800, orders: 412 },
  { name: "Ege Bahçeleri", location: "Ayvalık", revenue: 42900, orders: 286 },
  { name: "Merez Hatun", location: "Hakkâri", revenue: 35640, orders: 198 },
  { name: "Naciye'nin Mandırası", location: "Yüksekova", revenue: 26100, orders: 174 },
  { name: "Yayla Lezzetleri", location: "Şırnak", revenue: 13680, orders: 152 },
];

export const mockGeo: GeoRow[] = [
  { province: "İstanbul", orders: 386, revenue: 58200 },
  { province: "Ankara", orders: 214, revenue: 32100 },
  { province: "İzmir", orders: 178, revenue: 26800 },
  { province: "Bursa", orders: 96, revenue: 14400 },
  { province: "Antalya", orders: 88, revenue: 13200 },
  { province: "Hakkâri", orders: 42, revenue: 6300 },
];

export const mockActivity: Activity[] = [
  { kind: "order", text: "GO-2026-10472 · Karakovan Çam Balı × 2", at: "2 dk önce" },
  { kind: "application", text: "Yeni satıcı başvurusu · Yayla Lezzetleri", at: "11 dk önce" },
  { kind: "signup", text: "Yeni kullanıcı kaydı · ayse****@gmail.com", at: "23 dk önce" },
  { kind: "payout", text: "Ödeme talebi · Merez Hatun · ₺3.560", at: "41 dk önce" },
  { kind: "order", text: "GO-2026-10468 · Sızma Zeytinyağı × 1", at: "1 sa önce" },
  { kind: "signup", text: "Yeni kullanıcı kaydı · mehmet****@gmail.com", at: "2 sa önce" },
];

export type DateRange = "today" | "7d" | "30d" | "month" | "custom";
