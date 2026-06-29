"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { fmtPrice } from "@/lib/data";

export type Txn = {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  created_at: string;
};
export type Payout = { id: string; amount: number; status: string; created_at: string };

export function EarningsView({
  balance,
  transactions,
  payouts,
}: {
  balance: number;
  transactions: Txn[];
  payouts: Payout[];
}) {
  const { t, toast } = useStore();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestPayout(e: React.FormEvent) {
    e.preventDefault();
    const val = Number(amount);
    if (!val || val <= 0 || val > balance) {
      toast(t("vpNoBalance"));
      return;
    }
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("request_payout", { p_amount: val });
    setBusy(false);
    if (error) {
      toast(t("coError"));
      return;
    }
    toast(t("vpPayoutRequested"));
    setAmount("");
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-forest-deep">{t("vpEarnings")}</h1>

      <div className="rounded-3xl border border-gold/40 bg-amber-bg p-6">
        <p className="text-xs font-medium text-gold-deep">{t("vpBalance")}</p>
        <p className="mt-1 font-display text-3xl text-forest-deep">{fmtPrice(Number(balance))}</p>
        <form onSubmit={requestPayout} className="mt-4 flex flex-wrap items-end gap-2">
          <label className="flex-1">
            <span className="mb-1 block text-xs font-medium text-gold-deep">{t("vpAmount")}</span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-11 w-full rounded-xl border border-gold/40 bg-cream px-3.5 text-sm outline-none focus:border-gold"
            />
          </label>
          <button
            type="submit"
            disabled={busy || balance <= 0}
            className="h-11 rounded-full bg-gold px-5 text-sm font-semibold text-cream hover:bg-gold-deep disabled:opacity-60"
          >
            {t("vpRequestPayout")}
          </button>
        </form>
      </div>

      {payouts.length > 0 && (
        <>
          <h2 className="mb-2 mt-8 font-display text-lg text-forest-deep">{t("vpPayouts")}</h2>
          <div className="space-y-2">
            {payouts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-line bg-card p-3 text-sm"
              >
                <span className="text-muted">
                  {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(p.created_at))}
                </span>
                <span className="flex items-center gap-3">
                  <span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-forest">
                    {p.status}
                  </span>
                  <span className="font-display text-forest-deep">{fmtPrice(Number(p.amount))}</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="mb-2 mt-8 font-display text-lg text-forest-deep">{t("vpTxnHistory")}</h2>
      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-line bg-card p-8 text-center text-muted">
          {t("vpNoTxn")}
        </div>
      ) : (
        <div className="divide-y divide-line rounded-2xl border border-line bg-card">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-forest-deep">{tx.description ?? tx.type}</p>
                <p className="text-xs text-muted">
                  {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(tx.created_at))}
                </p>
              </div>
              <span
                className={`font-display text-sm ${
                  Number(tx.amount) < 0 ? "text-red-600" : "text-green-700"
                }`}
              >
                {Number(tx.amount) < 0 ? "" : "+"}
                {fmtPrice(Number(tx.amount))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
