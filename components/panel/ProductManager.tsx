"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "../store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { fmtPrice } from "@/lib/data";

type Category = { id: string; slug: string; name: string };
type Product = {
  id: string;
  name: string;
  price: number;
  old_price: number | null;
  unit: string;
  image: string | null;
  region: string | null;
  badge: string | null;
  description: string | null;
  cold_chain: boolean;
  status: string;
  category_id: string;
};

const statusKey: Record<string, string> = {
  draft: "vpStatusDraft",
  pending: "vpStatusPending",
  published: "vpStatusPublished",
  rejected: "vpStatusRejected",
};
const statusTone: Record<string, string> = {
  draft: "bg-canvas text-muted",
  pending: "bg-amber-bg text-gold-deep",
  published: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ığüşöçİ]/g, (c) => ({ ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c", İ: "i" })[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const blank = {
  name: "",
  price: "",
  old_price: "",
  unit: "",
  category_id: "",
  region: "",
  badge: "",
  description: "",
  cold_chain: false,
};

export function ProductManager({
  vendorId,
  products,
  categories,
}: {
  vendorId: string;
  products: Product[];
  categories: Category[];
}) {
  const { t, toast } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ ...blank });
  const [file, setFile] = useState<File | null>(null);
  const [keepImage, setKeepImage] = useState<string | null>(null);

  const upd = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  function openNew() {
    setEditingId(null);
    setForm({ ...blank, category_id: categories[0]?.id ?? "" });
    setFile(null);
    setKeepImage(null);
    setOpen(true);
  }
  function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      old_price: p.old_price ? String(p.old_price) : "",
      unit: p.unit,
      category_id: p.category_id,
      region: p.region ?? "",
      badge: p.badge ?? "",
      description: p.description ?? "",
      cold_chain: p.cold_chain,
    });
    setFile(null);
    setKeepImage(p.image);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      let image = keepImage;
      if (file) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${vendorId}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("products").upload(path, file, {
          upsert: true,
        });
        if (error) throw error;
        image = supabase.storage.from("products").getPublicUrl(path).data.publicUrl;
      }

      const payload = {
        name: form.name,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        unit: form.unit,
        category_id: form.category_id,
        region: form.region || null,
        badge: form.badge || null,
        description: form.description || null,
        cold_chain: form.cold_chain,
        image,
        status: "pending",
      };

      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert({
          ...payload,
          vendor_id: vendorId,
          slug: `${slugify(form.name)}-${Math.random().toString(36).slice(2, 6)}`,
        });
        if (error) throw error;
      }
      toast(t("vpSaved"));
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error("[product]", err);
      toast(t("coError"));
    } finally {
      setBusy(false);
    }
  }

  async function del(id: string) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast(t("coError"));
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-forest-deep">{t("vpProducts")}</h1>
        <button
          onClick={openNew}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-cream hover:bg-gold-deep"
        >
          {t("vpAddProduct")}
        </button>
      </div>

      {open && (
        <form onSubmit={save} className="mb-6 rounded-3xl border border-line bg-card p-6">
          <h2 className="font-display text-lg text-forest-deep">
            {editingId ? t("vpEditProduct") : t("vpAddProduct")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <In label={t("vpProductName")} value={form.name} onChange={(v) => upd("name", v)} required />
            </div>
            <Sel
              label={t("vpCategory")}
              value={form.category_id}
              onChange={(v) => upd("category_id", v)}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
            <In label={t("vpUnit")} value={form.unit} onChange={(v) => upd("unit", v)} required />
            <In label={t("vpPrice")} value={form.price} onChange={(v) => upd("price", v)} type="number" required />
            <In label={t("vpOldPrice")} value={form.old_price} onChange={(v) => upd("old_price", v)} type="number" />
            <In label={t("vpRegion")} value={form.region} onChange={(v) => upd("region", v)} />
            <In label={t("vpBadge")} value={form.badge} onChange={(v) => upd("badge", v)} />
            <div className="sm:col-span-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-forest-deep">{t("vpDescription")}</span>
                <textarea
                  value={form.description}
                  onChange={(e) => upd("description", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-forest-deep">{t("vpImage")}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-forest file:px-4 file:py-2 file:text-xs file:font-semibold file:text-cream"
              />
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm text-forest-deep">
              <input
                type="checkbox"
                checked={form.cold_chain}
                onChange={(e) => upd("cold_chain", e.target.checked)}
              />
              {t("vpColdChain")}
            </label>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-cream hover:bg-gold-deep disabled:opacity-60"
            >
              {busy ? t("vpSaving") : t("vpSave")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-muted"
            >
              ✕
            </button>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        <div className="rounded-2xl border border-line bg-card p-10 text-center text-muted">
          {t("vpNoProducts")}
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-card p-3"
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-canvas">
                {p.image && <Image src={p.image} alt={p.name} fill sizes="56px" className="object-cover" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-forest-deep">{p.name}</p>
                <p className="text-xs text-muted">
                  {fmtPrice(Number(p.price))} · {p.unit}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  statusTone[p.status] ?? "bg-canvas text-muted"
                }`}
              >
                {t(statusKey[p.status] ?? "vpStatusDraft")}
              </span>
              <button
                onClick={() => openEdit(p)}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-forest hover:border-forest/40"
              >
                ✎
              </button>
              <button
                onClick={() => del(p.id)}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                {t("vpDelete")}
              </button>
            </div>
          ))}
        </div>
      )}
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
      <span className="mb-1.5 block text-sm font-medium text-forest-deep">{label}</span>
      <input
        type={type}
        step={type === "number" ? "0.01" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="h-11 w-full rounded-xl border border-line bg-cream px-3.5 text-sm text-ink outline-none focus:border-gold"
      />
    </label>
  );
}

function Sel({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-forest-deep">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-line bg-cream px-3 text-sm text-ink outline-none focus:border-gold"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
