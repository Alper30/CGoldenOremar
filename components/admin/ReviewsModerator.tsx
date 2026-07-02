"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, ImageOff, Star, Trash2 } from "lucide-react";
import { useStore } from "@/components/store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type AdminReview = {
  id: string;
  author: string;
  location: string | null;
  rating: number;
  text: string;
  created_at: string;
  products: { name: string; slug: string; image: string | null } | null;
};

// Admin yorum moderasyonu — silme guard'lı RPC (admin_delete_review) ile yapılır;
// silmeden sonra ürün/satıcı agregatları sunucuda otomatik yeniden hesaplanır.
export function ReviewsModerator({ reviews }: { reviews: AdminReview[] }) {
  const { t } = useStore();
  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
        {t("adNoReviews")}
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-foreground">{t("adReviews")}</h1>
      <div className="space-y-2">
        {reviews.map((r) => (
          <Row key={r.id} r={r} />
        ))}
      </div>
    </div>
  );
}

function Row({ r }: { r: AdminReview }) {
  const { t, toast } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function del() {
    if (!confirm(t("adDeleteConfirm"))) return;
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("admin_delete_review", { p_id: r.id });
    setBusy(false);
    if (error) return toast(error.message || t("coError"));
    toast(t("adDone"));
    router.refresh();
  }

  const p = r.products;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      {/* Her satırın başında küçük ürün görseli → hangi ürüne ait olduğu anında belli.
          Tıklanınca ürün sayfası yeni sekmede açılır. */}
      {p ? (
        <Link
          href={`/urun/${p.slug}`}
          target="_blank"
          title={`${p.name} — ürünü aç`}
          className="group relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
        >
          {p.image ? (
            <Image src={p.image} alt={p.name} fill sizes="56px" className="object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-5" />
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">
            <ExternalLink className="size-4 text-background" />
          </span>
        </Link>
      ) : (
        <span className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
          <ImageOff className="size-5" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{r.author}</span>
          <span className="inline-flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`size-3.5 ${
                  i <= Math.round(r.rating)
                    ? "fill-gold text-gold"
                    : "text-muted-foreground/40"
                }`}
              />
            ))}
          </span>
        </div>
        {p && (
          <Link
            href={`/urun/${p.slug}`}
            target="_blank"
            className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
          >
            {p.name}
            <ExternalLink className="size-3" />
          </Link>
        )}
        <p className="mt-1.5 text-sm text-foreground/90">{r.text}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {[r.location, new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(r.created_at))]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      <button
        onClick={del}
        disabled={busy}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-60"
      >
        <Trash2 className="size-3.5" />
        {t("adDelete")}
      </button>
    </div>
  );
}
