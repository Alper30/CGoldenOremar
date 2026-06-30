"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/store";

type Form = {
  email: string;
  full_name: string;
  phone: string;
  store_name: string;
  tc_no: string;
  iban: string;
  province: string;
  district: string;
  story: string;
};

const EMPTY: Form = {
  email: "",
  full_name: "",
  phone: "",
  store_name: "",
  tc_no: "",
  iban: "",
  province: "",
  district: "",
  story: "",
};

export function AssistedVendorForm() {
  const { t, toast } = useStore();
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [busy, setBusy] = useState(false);

  const upd = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/assisted-vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || t("coError"));
        return;
      }
      toast(t("avSuccess"));
      setForm(EMPTY);
      router.refresh();
    } catch {
      toast(t("coError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground">{t("avTitle")}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("avDesc")}</p>

      <form
        onSubmit={submit}
        className="mt-5 max-w-2xl rounded-3xl border border-border bg-card p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <In label={t("avName")} value={form.full_name} onChange={upd("full_name")} required />
          <In label={t("avEmail")} type="email" value={form.email} onChange={upd("email")} required />
          <In label={t("avPhone")} value={form.phone} onChange={upd("phone")} required />
          <In label={t("avStore")} value={form.store_name} onChange={upd("store_name")} required />
          <In label={t("avTc")} value={form.tc_no} onChange={upd("tc_no")} required />
          <In label={t("avIban")} value={form.iban} onChange={upd("iban")} required />
          <In label={t("avProvince")} value={form.province} onChange={upd("province")} />
          <In label={t("avDistrict")} value={form.district} onChange={upd("district")} />
        </div>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">{t("avStory")}</span>
          <textarea
            rows={3}
            value={form.story}
            onChange={(e) => upd("story")(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-gold"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="mt-5 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-gold-deep disabled:opacity-60"
        >
          {busy ? t("avCreating") : t("avSubmit")}
        </button>
      </form>
    </div>
  );
}

function In({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none focus:border-gold"
      />
    </label>
  );
}
