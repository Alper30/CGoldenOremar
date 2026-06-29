"use client";

import { useStore } from "./store";
import { OrderActions } from "./OrderActions";
import { fmtPrice } from "@/lib/data";

export type AnyOrder = {
  id: string;
  created_at: string;
  grand_total: number;
  items_total: number;
  shipping_total: number;
  payment_status: string;
  order_vendors: Array<{
    id: string;
    escrow_status: string;
    items_subtotal: number;
    shipping_fee: number;
    tracking_no: string | null;
    tracking_carrier: string | null;
    vendor_profiles: { name: string; slug: string } | null;
    order_items: Array<{
      id: string;
      name: string;
      qty: number;
      unit_price: number;
      line_total: number;
    }>;
  }>;
};

const escrowKey: Record<string, string> = {
  pending: "escPending",
  shipped: "escShipped",
  delivered: "escDelivered",
  released: "escReleased",
  refunded: "escRefunded",
  disputed: "escDisputed",
};

const escrowTone: Record<string, string> = {
  pending: "bg-amber-bg text-gold-deep",
  shipped: "bg-blue-50 text-blue-700",
  delivered: "bg-blue-50 text-blue-700",
  released: "bg-green-50 text-green-700",
  refunded: "bg-canvas text-muted",
  disputed: "bg-red-50 text-red-700",
};

export function OrderCard({ order }: { order: AnyOrder }) {
  const { t } = useStore();
  const date = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(
    new Date(order.created_at),
  );

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
        <div>
          <p className="font-display text-sm text-forest-deep">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-xs text-muted">{date}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              order.payment_status === "paid"
                ? "bg-green-50 text-green-700"
                : "bg-amber-bg text-gold-deep"
            }`}
          >
            {t(order.payment_status === "paid" ? "payPaid" : "payPending")}
          </span>
          <span className="font-display text-lg text-forest-deep">
            {fmtPrice(Number(order.grand_total))}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-4">
        {order.order_vendors.map((ov) => (
          <div key={ov.id} className="rounded-xl bg-cream/60 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-forest-deep">
                {ov.vendor_profiles?.name ?? "—"}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  escrowTone[ov.escrow_status] ?? "bg-canvas text-muted"
                }`}
              >
                {t(escrowKey[ov.escrow_status] ?? "escPending")}
              </span>
            </div>

            <ul className="mt-2 space-y-1">
              {ov.order_items.map((it) => (
                <li key={it.id} className="flex justify-between text-sm">
                  <span className="text-ink/80">
                    {it.qty} × {it.name}
                  </span>
                  <span className="text-forest-deep">{fmtPrice(Number(it.line_total))}</span>
                </li>
              ))}
            </ul>

            {ov.tracking_no && (
              <p className="mt-2 text-xs text-muted">
                {t("ordCarrier")}: {ov.tracking_carrier} · {t("ordTrackNo")}: {ov.tracking_no}
              </p>
            )}

            <OrderActions orderVendorId={ov.id} escrow={ov.escrow_status} />
          </div>
        ))}
      </div>
    </div>
  );
}
