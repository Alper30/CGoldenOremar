"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import { useStore } from "@/components/store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type AdminReview = {
  id: string;
  author: string;
  location: string | null;
  rating: number;
  text: string;
  created_at: string;
  products: { name: string; slug: string } | null;
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

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card p-4">
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
          {r.products && (
            <span className="text-xs text-muted-foreground">· {r.products.name}</span>
          )}
        </div>
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
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-60"
      >
        <Trash2 className="size-3.5" />
        {t("adDelete")}
      </button>
    </div>
  );
}
