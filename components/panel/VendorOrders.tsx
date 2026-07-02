"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { fmtPrice } from "@/lib/data";

export type OV = {
  id: string;
  escrow_status: string;
  items_subtotal: number;
  net_amount: number;
  tracking_no: string | null;
  tracking_carrier: string | null;
  created_at: string;
  order_items: Array<{ name: string; qty: number }>;
  orders: {
    ship_name: string | null;
    ship_line: string | null;
    ship_district: string | null;
    ship_province: string | null;
  } | null;
};

const escrowKey: Record<string, string> = {
  pending: "vpAwaitingShip",
  shipped: "escShipped",
  delivered: "escDelivered",
  released: "escReleased",
  refunded: "escRefunded",
  disputed: "escDisputed",
};

export function VendorOrders({ orders }: { orders: OV[] }) {
  const { t } = useStore();
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-card p-10 text-center text-muted">
        {t("vpNoOrders")}
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-forest-deep">{t("vpOrders")}</h1>
      <div className="space-y-3">
        {orders.map((ov) => (
          <Row key={ov.id} ov={ov} />
        ))}
      </div>
    </div>
  );
}

function Row({ ov }: { ov: OV }) {
  const { t, toast } = useStore();
  const router = useRouter();
  const [carrier, setCarrier] = useState("");
  const [trackNo, setTrackNo] = useState("");
  const [busy, setBusy] = useState(false);

  async function ship(e: React.FormEvent) {
    e.preventDefault();
    if (!trackNo.trim()) {
      toast(t("vpTrackRequired"));
      return;
    }
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("mark_shipped", {
      p_order_vendor_id: ov.id,
      p_carrier: carrier,
      p_tracking_no: trackNo,
    });
    setBusy(false);
    if (error) {
      toast(t("coError"));
      return;
    }
    // Alıcıya "kargoda" e-postası (best effort — başarısızlığı akışı etkilemez).
    fetch("/api/notify/shipped", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderVendorId: ov.id }),
    }).catch(() => {});
    toast(t("vpShipped"));
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
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

      {ov.orders && (
        <p className="mt-1 text-xs text-muted">
          {ov.orders.ship_name} · {ov.orders.ship_line}, {ov.orders.ship_district}/{ov.orders.ship_province}
        </p>
      )}

      {ov.escrow_status === "pending" ? (
        <form onSubmit={ship} className="mt-3 flex flex-wrap items-end gap-2">
          <label className="flex-1">
            <span className="mb-1 block text-xs font-medium text-muted">{t("vpCarrier")}</span>
            <input
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="h-10 w-full rounded-xl border border-line bg-cream px-3 text-sm outline-none focus:border-gold"
            />
          </label>
          <label className="flex-1">
            <span className="mb-1 block text-xs font-medium text-muted">{t("vpTrackNoInput")}</span>
            <input
              value={trackNo}
              onChange={(e) => setTrackNo(e.target.value)}
              required
              className="h-10 w-full rounded-xl border border-line bg-cream px-3 text-sm outline-none focus:border-gold"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="h-10 rounded-full bg-forest px-4 text-xs font-semibold text-cream hover:bg-forest-deep disabled:opacity-60"
          >
            {t("vpMarkShipped")}
          </button>
        </form>
      ) : (
        ov.tracking_no && (
          <p className="mt-2 text-xs text-muted">
            {t("ordCarrier")}: {ov.tracking_carrier} · {t("ordTrackNo")}: {ov.tracking_no}
          </p>
        )
      )}
    </div>
  );
}
