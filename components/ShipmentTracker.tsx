"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "./store";
import { fmtPrice } from "@/lib/data";
import type { AnyOrder } from "./OrderCard";
import {
  SearchIcon,
  TruckIcon,
  VerifiedIcon,
  ClockIcon,
  ArrowRightIcon,
} from "./icons";

// Gerçek siparişlerden kargo durumunu izler. Adım zaman çizelgesi, alt-siparişin
// (order_vendor) escrow_status + ödeme durumundan TÜRETİLİR — sahte demo yok.
const STEP_KEYS = ["trkStep1", "trkStep2", "trkStep3", "trkStep4", "trkStep5"];

// escrow_status + ödeme → aktif adım indeksi (0..4). refunded/disputed = özel.
function activeStep(escrow: string, paid: boolean): number {
  switch (escrow) {
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    case "released":
      return 4;
    case "pending":
    default:
      return paid ? 1 : 0;
  }
}

export function ShipmentTracker({
  orders,
  signedIn,
}: {
  orders: AnyOrder[];
  signedIn: boolean;
}) {
  const { t } = useStore();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return orders;
    return orders.filter((o) => {
      if (o.id.toLowerCase().includes(needle)) return true;
      return o.order_vendors.some((ov) =>
        (ov.tracking_no ?? "").toLowerCase().includes(needle),
      );
    });
  }, [orders, q]);

  return (
    <div>
      <section className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            {t("trkTitle")}
          </p>
          <h1 className="mt-2 font-display text-4xl text-forest-deep lg:text-5xl">
            {t("trkTitle")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted">
            {t("trkSub")}
          </p>

          {signedIn && orders.length > 0 && (
            <div className="mx-auto mt-6 flex max-w-md items-center gap-2.5">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("trkSearch")}
                  className="h-12 w-full rounded-full border border-line bg-card pl-11 pr-4 text-sm text-ink outline-none placeholder:text-muted focus:border-gold"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        {!signedIn ? (
          <Empty>
            {t("trkGuest")}{" "}
            <Link href="/giris" className="font-semibold text-forest hover:text-gold">
              {t("revGuestCta")}
              <ArrowRightIcon className="ml-1 inline h-4 w-4" />
            </Link>
          </Empty>
        ) : orders.length === 0 ? (
          <Empty>{t("trkNone")}</Empty>
        ) : filtered.length === 0 ? (
          <Empty>{t("trkNoMatch")}</Empty>
        ) : (
          <div className="space-y-5">
            {filtered.map((o) => (
              <OrderBlock key={o.id} order={o} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function OrderBlock({ order }: { order: AnyOrder }) {
  const { t } = useStore();
  const date = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(
    new Date(order.created_at),
  );
  const paid = order.payment_status === "paid";

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
        <div>
          <p className="font-display text-sm text-forest-deep">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-xs text-muted">{date}</p>
        </div>
        <span className="font-display text-lg text-forest-deep">
          {fmtPrice(Number(order.grand_total))}
        </span>
      </div>

      <div className="mt-4 space-y-5">
        {order.order_vendors.map((ov) => {
          const special =
            ov.escrow_status === "refunded" || ov.escrow_status === "disputed";
          const idx = activeStep(ov.escrow_status, paid);
          return (
            <div key={ov.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-forest-deep">
                  {ov.vendor_profiles?.name ?? "—"}
                </span>
                {ov.tracking_no && (
                  <span className="text-xs text-muted">
                    {ov.tracking_carrier} · {ov.tracking_no}
                  </span>
                )}
              </div>

              <ul className="mt-1 text-sm text-ink/80">
                {ov.order_items.map((it) => (
                  <li key={it.id}>
                    {it.qty} × {it.name}
                  </li>
                ))}
              </ul>

              {special ? (
                <div className="mt-3 rounded-xl bg-canvas px-4 py-3 text-sm font-semibold text-forest-deep">
                  {t(ov.escrow_status === "refunded" ? "escRefunded" : "escDisputed")}
                </div>
              ) : (
                <ol className="mt-3 flex items-center">
                  {STEP_KEYS.map((k, i) => {
                    const done = i < idx;
                    const current = i === idx;
                    const last = i === STEP_KEYS.length - 1;
                    return (
                      <li key={k} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center text-center">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full ${
                              done
                                ? "bg-success text-white"
                                : current
                                  ? "bg-gold text-white"
                                  : "border border-line bg-cream text-muted"
                            }`}
                          >
                            {done ? (
                              <VerifiedIcon className="h-4 w-4" />
                            ) : current ? (
                              <TruckIcon className="h-4 w-4" />
                            ) : (
                              <ClockIcon className="h-4 w-4" />
                            )}
                          </span>
                          <span
                            className={`mt-1 hidden w-16 text-[11px] leading-tight sm:block ${
                              current ? "font-semibold text-gold-deep" : "text-muted"
                            }`}
                          >
                            {t(k)}
                          </span>
                        </div>
                        {!last && (
                          <span
                            className={`mx-1 h-0.5 flex-1 ${
                              done ? "bg-success/50" : "bg-line"
                            }`}
                          />
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-10 text-center text-sm text-muted">
      {children}
    </div>
  );
}
