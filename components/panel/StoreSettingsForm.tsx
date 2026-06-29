"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Vendor = {
  name: string;
  person: string;
  story: string | null;
  location: string | null;
  province: string | null;
  district: string | null;
  iban: string | null;
};

export function StoreSettingsForm({ vendor }: { vendor: Vendor }) {
  const { t, toast } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: vendor.name,
    person: vendor.person,
    story: vendor.story ?? "",
    location: vendor.location ?? "",
    province: vendor.province ?? "",
    district: vendor.district ?? "",
    iban: vendor.iban ?? "",
  });

  const upd = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("update_vendor_profile", { p_patch: form });
    setBusy(false);
    if (error) {
      toast(t("coError"));
      return;
    }
    toast(t("vpSaved"));
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-forest-deep">{t("vpSettings")}</h1>
      <form onSubmit={save} className="rounded-3xl border border-line bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <In label={t("soStore")} value={form.name} onChange={upd("name")} />
          <In label={t("soPerson")} value={form.person} onChange={upd("person")} />
          <In label={t("soProvince")} value={form.province} onChange={upd("province")} />
          <In label={t("soDistrict")} value={form.district} onChange={upd("district")} />
          <In label={t("coAddress")} value={form.location} onChange={upd("location")} />
          <In label={t("soIban")} value={form.iban} onChange={upd("iban")} />
          <div className="sm:col-span-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-forest-deep">{t("soStory")}</span>
              <textarea
                value={form.story}
                onChange={(e) => upd("story")(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold"
              />
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-5 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-cream hover:bg-gold-deep disabled:opacity-60"
        >
          {busy ? t("vpSaving") : t("vpSave")}
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
      <span className="mb-1.5 block text-sm font-medium text-forest-deep">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-line bg-cream px-3.5 text-sm text-ink outline-none focus:border-gold"
      />
    </label>
  );
}
