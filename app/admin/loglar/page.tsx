import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ShoppingCart,
  Wallet,
  FileCheck2,
  PackageSearch,
  ArrowLeftRight,
} from "lucide-react";
import { fmtPrice } from "@/lib/data";

export const metadata = { title: "Aktivite Kaydı · Yönetim" };

// Denetim akışı — ayrı bir audit tablosu yerine mevcut kayıtlardan (sipariş,
// para hareketi, payout, KYC, ürün moderasyonu) birleşik zaman çizelgesi üretir.
// Her para hareketi zaten vendor_transactions'ta kalıcı iz bırakır (audit trail).

type LogEvent = {
  ts: string;
  icon: "order" | "txn" | "payout" | "kyc" | "product";
  text: string;
  detail?: string;
};

const ICONS = {
  order: ShoppingCart,
  txn: ArrowLeftRight,
  payout: Wallet,
  kyc: FileCheck2,
  product: PackageSearch,
} as const;

const TXN_LABEL: Record<string, string> = {
  sale: "Satış",
  commission: "Komisyon kesintisi",
  payout: "Payout",
  refund: "İade",
  adjustment: "Düzeltme",
};

const fmtTs = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso),
  );

export default async function AdminLogsPage() {
  const supabase = await createSupabaseServerClient();

  const [orders, txns, payouts, apps, products] = await Promise.all([
    supabase
      .from("orders")
      .select("id, grand_total, payment_status, created_at")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("vendor_transactions")
      .select("id, type, amount, description, created_at, vendor_profiles(name)")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("payouts")
      .select("id, amount, status, created_at, processed_at, vendor_profiles(name)")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("vendor_applications")
      .select("id, store_name, status, created_at, reviewed_at")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("products")
      .select("id, name, status, created_at, vendor_profiles(name)")
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  const events: LogEvent[] = [];

  for (const o of orders.data ?? []) {
    events.push({
      ts: o.created_at,
      icon: "order",
      text: `Sipariş oluşturuldu · #${o.id.slice(0, 8).toUpperCase()}`,
      detail: `${fmtPrice(Number(o.grand_total))} · ödeme: ${o.payment_status}`,
    });
  }
  for (const t of txns.data ?? []) {
    const vendor = (t.vendor_profiles as unknown as { name: string } | null)?.name ?? "—";
    events.push({
      ts: t.created_at,
      icon: "txn",
      text: `${TXN_LABEL[t.type] ?? t.type} · ${vendor}`,
      detail: `${fmtPrice(Number(t.amount))}${t.description ? ` · ${t.description}` : ""}`,
    });
  }
  for (const p of payouts.data ?? []) {
    const vendor = (p.vendor_profiles as unknown as { name: string } | null)?.name ?? "—";
    events.push({
      ts: p.created_at,
      icon: "payout",
      text: `Payout talebi · ${vendor}`,
      detail: `${fmtPrice(Number(p.amount))} · durum: ${p.status === "paid" ? "ödendi" : p.status}`,
    });
    if (p.processed_at) {
      events.push({
        ts: p.processed_at,
        icon: "payout",
        text: `Payout ödendi · ${vendor}`,
        detail: fmtPrice(Number(p.amount)),
      });
    }
  }
  for (const a of apps.data ?? []) {
    events.push({
      ts: a.created_at,
      icon: "kyc",
      text: `KYC başvurusu · ${a.store_name}`,
      detail: "başvuru alındı",
    });
    if (a.reviewed_at) {
      events.push({
        ts: a.reviewed_at,
        icon: "kyc",
        text: `KYC kararı · ${a.store_name}`,
        detail: a.status === "approved" ? "onaylandı" : a.status === "rejected" ? "reddedildi" : a.status,
      });
    }
  }
  for (const pr of products.data ?? []) {
    const vendor = (pr.vendor_profiles as unknown as { name: string } | null)?.name ?? "—";
    events.push({
      ts: pr.created_at,
      icon: "product",
      text: `Ürün eklendi · ${pr.name}`,
      detail: `${vendor} · durum: ${pr.status}`,
    });
  }

  events.sort((a, b) => (a.ts < b.ts ? 1 : -1));
  const timeline = events.slice(0, 60);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Platformdaki son olaylar — sipariş, para hareketi, payout, KYC ve ürün
        kayıtlarından birleştirilir. Tüm para hareketleri kalıcı olarak
        işlem dökümünde saklanır.
      </p>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {timeline.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">
              Henüz kayıtlı olay yok.
            </li>
          )}
          {timeline.map((e, i) => {
            const Icon = ICONS[e.icon];
            return (
              <li key={i} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{e.text}</p>
                  {e.detail && (
                    <p className="text-xs text-muted-foreground">{e.detail}</p>
                  )}
                </div>
                <time className="shrink-0 text-xs text-muted-foreground">
                  {fmtTs(e.ts)}
                </time>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
