"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { fmtPrice } from "@/lib/data";

export type Payout = {
  id: string;
  amount: number;
  iban: string | null;
  created_at: string;
  vendor_profiles: { name: string } | null;
};

export function PayoutsManager({ payouts }: { payouts: Payout[] }) {
  const { t } = useStore();
  if (payouts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
        {t("vpNoTxn")}
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-foreground">{t("adPayouts")}</h1>
      <div className="space-y-2">
        {payouts.map((p) => (
          <Row key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}

function Row({ p }: { p: Payout }) {
  const { t, toast } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function markPaid() {
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    // Para tablosuna doğrudan yazma YOK — guard'lı RPC (admin kontrolü + durum
    // doğrulaması DB'de). Bakiye, payout talebinde zaten düşüldü → burada düşülmez.
    const { error } = await supabase.rpc("mark_payout_paid", { p_payout_id: p.id });
    setBusy(false);
    if (error) return toast(t("coError"));
    toast(t("adDone"));
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{p.vendor_profiles?.name}</p>
        <p className="text-xs text-muted-foreground">
          {p.iban} ·{" "}
          {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(p.created_at))}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-display text-lg text-foreground">{fmtPrice(Number(p.amount))}</span>
        <button
          onClick={markPaid}
          disabled={busy}
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary disabled:opacity-60"
        >
          {t("adMarkPaid")}
        </button>
      </div>
    </div>
  );
}
