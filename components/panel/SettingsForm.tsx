"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Settings = {
  commission_rate: number;
  escrow_auto_confirm_days: number;
  free_shipping_threshold: number;
  shipping_fee: number;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const { t, toast } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    commissionPct: String(Number(settings.commission_rate) * 100),
    days: String(settings.escrow_auto_confirm_days),
    freeShip: String(settings.free_shipping_threshold),
    shipFee: String(settings.shipping_fee),
  });

  const upd = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("platform_settings")
      .update({
        commission_rate: Number(form.commissionPct) / 100,
        escrow_auto_confirm_days: Math.round(Number(form.days)),
        free_shipping_threshold: Number(form.freeShip),
        shipping_fee: Number(form.shipFee),
      })
      .eq("id", true);
    setBusy(false);
    if (error) return toast(t("coError"));
    toast(t("adDone"));
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-foreground">{t("adSettings")}</h1>
      <form onSubmit={save} className="max-w-md rounded-3xl border border-border bg-card p-6">
        <div className="space-y-4">
          <In label={t("adCommissionRate")} value={form.commissionPct} onChange={upd("commissionPct")} />
          <In label={t("adEscrowDays")} value={form.days} onChange={upd("days")} />
          <In label={t("adFreeShip")} value={form.freeShip} onChange={upd("freeShip")} />
          <In label={t("adShipFee")} value={form.shipFee} onChange={upd("shipFee")} />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-5 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-gold-deep disabled:opacity-60"
        >
          {busy ? t("vpSaving") : t("adSaveSettings")}
        </button>
      </form>
    </div>
  );
}

function In({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none focus:border-gold"
      />
    </label>
  );
}
