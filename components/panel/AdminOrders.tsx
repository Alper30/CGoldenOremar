"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { fmtPrice } from "@/lib/data";

type Disputed = {
  id: string;
  items_subtotal: number;
  net_amount: number;
  vendor_profiles: { name: string } | null;
  order_items: Array<{ name: string; qty: number }>;
};
type RecentOrder = {
  id: string;
  grand_total: number;
  payment_status: string;
  created_at: string;
};

export function AdminOrders({
  disputed,
  recent,
}: {
  disputed: Disputed[];
  recent: RecentOrder[];
}) {
  const { t } = useStore();
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-forest-deep">{t("adOrders")}</h1>

      {disputed.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 text-sm font-semibold text-red-700">{t("escDisputed")}</h2>
          <div className="space-y-3">
            {disputed.map((d) => (
              <DisputeRow key={d.id} d={d} />
            ))}
          </div>
        </section>
      )}

      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-canvas text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">{t("coOrderNo")}</th>
              <th className="px-4 py-3 font-medium">{t("ordDate")}</th>
              <th className="px-4 py-3 font-medium">{t("adRole")}</th>
              <th className="px-4 py-3 text-right font-medium">{t("coTotal")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {recent.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-medium text-forest-deep">
                  #{o.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(o.created_at))}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      o.payment_status === "paid"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-bg text-gold-deep"
                    }`}
                  >
                    {t(o.payment_status === "paid" ? "payPaid" : "payPending")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-display text-forest-deep">
                  {fmtPrice(Number(o.grand_total))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DisputeRow({ d }: { d: Disputed }) {
  const { t, toast } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function resolve(action: "release" | "refund") {
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("resolve_dispute", {
      p_order_vendor_id: d.id,
      p_action: action,
    });
    setBusy(false);
    if (error) return toast(t("coError"));
    toast(t("adDone"));
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-ink/80">
          <strong className="text-forest-deep">{d.vendor_profiles?.name}</strong> ·{" "}
          {d.order_items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
        </span>
        <span className="font-display text-sm text-forest-deep">{fmtPrice(Number(d.items_subtotal))}</span>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => resolve("release")}
          disabled={busy}
          className="rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60"
        >
          {t("adRelease")}
        </button>
        <button
          onClick={() => resolve("refund")}
          disabled={busy}
          className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
        >
          {t("adRefund")}
        </button>
      </div>
    </div>
  );
}
