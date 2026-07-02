"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { fmtPrice } from "@/lib/data";
import { deleteProduct, saveProduct, setProductStatus } from "@/app/admin/urunler/actions";

// Admin ürün yönetimi: tüm satıcıların ürünleri üzerinde tam CRUD +
// yayın durumu kontrolü. products tablosunda "admin tam yetki" RLS'i olduğu
// için doğrudan tabloya yazılır; ayrı RPC gerekmez. Fiyat/stok yine sunucuda
// saklanır, istemci yalnız girişi iletir.

type Vendor = { id: string; name: string };
type Category = { id: string; slug: string; name: string };
export type AdminProduct = {
  id: string;
  name: string;
  price: number;
  old_price: number | null;
  unit: string;
  stock: number | null;
  image: string | null;
  region: string | null;
  badge: string | null;
  description: string | null;
  cold_chain: boolean;
  status: string;
  category_id: string;
  vendor_id: string;
  vendor_profiles: { name: string } | null;
  categories: { name: string } | null;
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Taslak",
  pending: "Bekleyen",
  published: "Yayında",
  rejected: "Reddedildi",
};
const STATUS_TONE: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
};

const FILTERS = ["all", "pending", "published", "draft", "rejected"] as const;
type Filter = (typeof FILTERS)[number];
const FILTER_LABEL: Record<Filter, string> = {
  all: "Tümü",
  pending: "Bekleyen",
  published: "Yayında",
  draft: "Taslak",
  rejected: "Reddedildi",
};

const blank = {
  name: "",
  vendor_id: "",
  category_id: "",
  status: "published",
  price: "",
  old_price: "",
  unit: "",
  stock: "",
  region: "",
  badge: "",
  description: "",
  cold_chain: false,
};

export function AdminProductManager({
  products,
  vendors,
  categories,
}: {
  products: AdminProduct[];
  vendors: Vendor[];
  categories: Category[];
}) {
  const [filter, setFilter] = useState<Filter>("pending");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [form, setForm] = useState({ ...blank });
  const [file, setFile] = useState<File | null>(null);
  const [keepImage, setKeepImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products.length };
    for (const p of products) c[p.status] = (c[p.status] ?? 0) + 1;
    return c;
  }, [products]);

  const visible = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.status === filter)),
    [products, filter],
  );

  const upd = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  function openNew() {
    setEditingId(null);
    setError(null);
    setForm({
      ...blank,
      vendor_id: vendors[0]?.id ?? "",
      category_id: categories[0]?.id ?? "",
    });
    setFile(null);
    setKeepImage(null);
    setOpen(true);
  }

  function openEdit(p: AdminProduct) {
    setEditingId(p.id);
    setError(null);
    setForm({
      name: p.name,
      vendor_id: p.vendor_id,
      category_id: p.category_id,
      status: p.status,
      price: String(p.price),
      old_price: p.old_price != null ? String(p.old_price) : "",
      unit: p.unit,
      stock: p.stock != null ? String(p.stock) : "",
      region: p.region ?? "",
      badge: p.badge ?? "",
      description: p.description ?? "",
      cold_chain: p.cold_chain,
    });
    setFile(null);
    setKeepImage(p.image);
    setOpen(true);
  }

  // Tüm yazma işlemleri SERVER ACTION üzerinden (server client). Başarıda
  // revalidatePath('/admin/urunler') listeyi otomatik tazeler → yeni props gelir.
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.vendor_id) {
      setError("Lütfen bir satıcı seçin.");
      return;
    }
    setBusy("save");
    setError(null);

    const fd = new FormData();
    if (editingId) fd.set("id", editingId);
    fd.set("vendor_id", form.vendor_id);
    fd.set("category_id", form.category_id);
    fd.set("name", form.name);
    fd.set("status", form.status);
    fd.set("unit", form.unit);
    fd.set("price", form.price);
    fd.set("old_price", form.old_price);
    fd.set("stock", form.stock);
    fd.set("region", form.region);
    fd.set("badge", form.badge);
    fd.set("description", form.description);
    fd.set("cold_chain", String(form.cold_chain));
    if (keepImage) fd.set("keepImage", keepImage);
    if (file) fd.set("image", file);

    const res = await saveProduct(fd);
    setBusy(null);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setOpen(false);
  }

  async function setStatus(id: string, status: string) {
    setBusy(id);
    setError(null);
    const res = await setProductStatus(id, status);
    setBusy(null);
    if ("error" in res) setError(res.error);
  }

  async function del(id: string) {
    setBusy(id);
    setError(null);
    const res = await deleteProduct(id);
    setBusy(null);
    if ("error" in res) setError(res.error);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl text-foreground">Ürün Yönetimi</h1>
        <button
          onClick={openNew}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          + Ürün Ekle
        </button>
      </div>

      {/* Statü filtreleri */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {FILTER_LABEL[f]}
            <span className="ml-1.5 opacity-70">{counts[f] ?? 0}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {open && (
        <form onSubmit={save} className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-lg text-foreground">
            {editingId ? "Ürünü Düzenle" : "Yeni Ürün"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <In label="Ürün adı" value={form.name} onChange={(v) => upd("name", v)} required />
            </div>
            <Sel
              label="Satıcı"
              value={form.vendor_id}
              onChange={(v) => upd("vendor_id", v)}
              options={vendors.map((v) => ({ value: v.id, label: v.name }))}
            />
            <Sel
              label="Kategori"
              value={form.category_id}
              onChange={(v) => upd("category_id", v)}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
            <Sel
              label="Yayın durumu"
              value={form.status}
              onChange={(v) => upd("status", v)}
              options={(["published", "pending", "draft", "rejected"] as const).map((s) => ({
                value: s,
                label: STATUS_LABEL[s],
              }))}
            />
            <In label="Birim (ör. 500g kavanoz)" value={form.unit} onChange={(v) => upd("unit", v)} required />
            <In label="Fiyat (₺)" value={form.price} onChange={(v) => upd("price", v)} type="number" required />
            <In label="Eski fiyat (₺)" value={form.old_price} onChange={(v) => upd("old_price", v)} type="number" />
            <In label="Stok" value={form.stock} onChange={(v) => upd("stock", v)} type="number" />
            <In label="Menşe / Bölge" value={form.region} onChange={(v) => upd("region", v)} />
            <In label="Rozet (ör. Şekersiz)" value={form.badge} onChange={(v) => upd("badge", v)} />
            <div className="sm:col-span-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-foreground">Açıklama</span>
                <textarea
                  value={form.description}
                  onChange={(e) => upd("description", e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Görsel</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-secondary-foreground"
              />
              {keepImage && !file && (
                <span className="mt-1 block truncate text-xs text-muted-foreground">Mevcut görsel korunuyor</span>
              )}
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.cold_chain}
                onChange={(e) => upd("cold_chain", e.target.checked)}
              />
              Soğuk zincir ürünü
            </label>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={busy === "save"}
              className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {busy === "save" ? "Kaydediliyor…" : "Kaydet"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}

      {visible.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
          Bu filtrede ürün yok.
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                {p.image && <Image src={p.image} alt={p.name} fill sizes="64px" className="object-cover" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.vendor_profiles?.name ?? "—"} · {p.categories?.name ?? "—"}
                  {p.region ? ` · ${p.region}` : ""}
                </p>
                <p className="text-sm text-foreground">{fmtPrice(Number(p.price))}</p>
              </div>
              <span
                className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:inline ${
                  STATUS_TONE[p.status] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {STATUS_LABEL[p.status] ?? p.status}
              </span>
              <div className="flex shrink-0 items-center gap-1.5">
                {p.status !== "published" && (
                  <button
                    onClick={() => setStatus(p.id, "published")}
                    disabled={busy === p.id}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                  >
                    Yayınla
                  </button>
                )}
                {p.status === "published" && (
                  <button
                    onClick={() => setStatus(p.id, "draft")}
                    disabled={busy === p.id}
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground disabled:opacity-60"
                  >
                    Yayından al
                  </button>
                )}
                {p.status === "pending" && (
                  <button
                    onClick={() => setStatus(p.id, "rejected")}
                    disabled={busy === p.id}
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-500/10"
                  >
                    Reddet
                  </button>
                )}
                <button
                  onClick={() => openEdit(p)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => del(p.id)}
                  disabled={busy === p.id}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-500/10"
                >
                  Sil
                </button>
              </div>
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
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        step={type === "number" ? "0.01" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-foreground outline-none focus:border-primary"
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
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
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
