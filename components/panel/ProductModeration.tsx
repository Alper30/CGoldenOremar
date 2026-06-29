"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "../store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { fmtPrice } from "@/lib/data";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  region: string | null;
  vendor_profiles: { name: string } | null;
  categories: { name: string } | null;
};

export function ProductModeration({ products }: { products: Product[] }) {
  const { t } = useStore();
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-card p-10 text-center text-muted">
        {t("adNoPending")}
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-forest-deep">{t("adProductMod")}</h1>
      <div className="space-y-2">
        {products.map((p) => (
          <Row key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}

function Row({ p }: { p: Product }) {
  const { t, toast } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(status: "published" | "rejected") {
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("products").update({ status }).eq("id", p.id);
    setBusy(false);
    if (error) return toast(t("coError"));
    toast(t("adDone"));
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-card p-3">
      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-canvas">
        {p.image && <Image src={p.image} alt={p.name} fill sizes="64px" className="object-cover" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-forest-deep">{p.name}</p>
        <p className="text-xs text-muted">
          {p.vendor_profiles?.name} · {p.categories?.name} · {p.region}
        </p>
        <p className="text-sm text-forest-deep">{fmtPrice(Number(p.price))}</p>
      </div>
      <button
        onClick={() => setStatus("published")}
        disabled={busy}
        className="rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60"
      >
        {t("adPublish")}
      </button>
      <button
        onClick={() => setStatus("rejected")}
        disabled={busy}
        className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
      >
        {t("adReject")}
      </button>
    </div>
  );
}
