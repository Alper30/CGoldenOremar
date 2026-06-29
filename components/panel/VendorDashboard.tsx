"use client";

import Link from "next/link";
import { useStore } from "../store";
import { fmtPrice } from "@/lib/data";

type Vendor = {
  id: string;
  name: string;
  balance: number;
  units_sold: number;
  rating: number;
  review_count: number;
};

type RecentOV = {
  id: string;
  escrow_status: string;
  net_amount: number;
  created_at: string;
  order_items: Array<{ name: string; qty: number }>;
};

const escrowKey: Record<string, string> = {
  pending: "escPending",
  shipped: "escShipped",
  delivered: "escDelivered",
  released: "escReleased",
  refunded: "escRefunded",
  disputed: "escDisputed",
};

export function VendorDashboard({
  vendor,
  pending,
  published,
  recent,
}: {
  vendor: Vendor;
  pending: number;
  published: number;
  recent: RecentOV[];
}) {
  const { t } = useStore();

  const stats = [
    { label: t("vpBalance"), value: fmtPrice(Number(vendor.balance)), accent: true },
    { label: t("vpUnitsSold"), value: String(vendor.units_sold) },
    { label: t("vpRating"), value: `${vendor.rating} (${vendor.review_count})` },
    { label: t("vpPendingProducts"), value: String(pending) },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-deep sm:text-3xl">{vendor.name}</h1>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border p-4 ${
              s.accent ? "border-gold/40 bg-amber-bg" : "border-line bg-card"
            }`}
          >
            <p className="text-xs font-medium text-muted">{s.label}</p>
            <p className="mt-1 font-display text-2xl text-forest-deep">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/satici-panel/urunler"
          className="inline-flex items-center rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream hover:bg-forest-deep"
        >
          {t("vpAddProduct")}
        </Link>
        <span className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-medium text-muted">
          {published} {t("vpStatusPublished")}
        </span>
      </div>

      <h2 className="mb-3 mt-10 font-display text-xl text-forest-deep">{t("vpOrders")}</h2>
      {recent.length === 0 ? (
        <div className="rounded-2xl border border-line bg-card p-8 text-center text-muted">
          {t("vpNoOrders")}
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((ov) => (
            <div
              key={ov.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-card p-4"
            >
              <span className="text-sm text-ink/80">
                {ov.order_items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
              </span>
              <span className="flex items-center gap-3">
                <span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-forest">
                  {t(escrowKey[ov.escrow_status] ?? "escPending")}
                </span>
                <span className="font-display text-sm text-forest-deep">
                  {fmtPrice(Number(ov.net_amount))}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
