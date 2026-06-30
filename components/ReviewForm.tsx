"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "./store";
import { useAuth } from "./AuthProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { StarIcon } from "./icons";

type State = "loading" | "not_purchased" | "can_review" | "reviewed";

// Yorum yazma formu — yalnızca ürünü satın almış alıcıya açılır (verified purchase).
// Uygunluk sunucuda (my_review RPC) belirlenir; istemci yalnızca durumu yansıtır.
export function ReviewForm({ productSlug }: { productSlug: string }) {
  const { t, toast } = useStore();
  const { signedIn } = useAuth();
  const router = useRouter();

  const [state, setState] = useState<State>("loading");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  // Misafir durumu prop'tan render'da türetilir (effect'te setState yok).
  useEffect(() => {
    if (!signedIn) return;
    let alive = true;
    (async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.rpc("my_review", {
        p_product_slug: productSlug,
      });
      if (!alive) return;
      if (error || !data) {
        setState("not_purchased");
        return;
      }
      const d = data as {
        state: "not_purchased" | "can_review" | "reviewed";
        rating?: number;
        text?: string;
      };
      if (d.state === "reviewed") {
        setRating(d.rating ?? 5);
        setText(d.text ?? "");
      }
      setState(d.state);
    })();
    return () => {
      alive = false;
    };
  }, [signedIn, productSlug]);

  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-line bg-canvas p-4 text-sm text-muted">
        {t("revGuest")}{" "}
        <Link href="/giris" className="font-semibold text-forest hover:text-gold">
          {t("revGuestCta")}
        </Link>
      </div>
    );
  }

  async function submit() {
    if (text.trim().length < 3) return toast(t("revPlaceholder"));
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("submit_review", {
      p_product_slug: productSlug,
      p_rating: rating,
      p_text: text.trim(),
    });
    setBusy(false);
    if (error) return toast(error.message || t("coError"));
    toast(t("revThanks"));
    setState("reviewed");
    router.refresh();
  }

  if (state === "loading") {
    return <div className="h-10 animate-pulse rounded-xl bg-canvas" />;
  }

  if (state === "not_purchased") {
    return (
      <div className="rounded-2xl border border-line bg-canvas p-4 text-sm text-muted">
        {t("revOnlyBuyers")}
      </div>
    );
  }

  // can_review | reviewed
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <p className="text-sm font-semibold text-forest-deep">
        {state === "reviewed" ? t("revUpdateTitle") : t("revWriteTitle")}
      </p>
      {state === "reviewed" && (
        <p className="mt-1 text-xs text-muted">{t("revReviewed")}</p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <span className="text-sm text-muted">{t("revYourRating")}</span>
        <div className="flex items-center" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i} yıldız`}
              onMouseEnter={() => setHover(i)}
              onClick={() => setRating(i)}
              className="p-0.5"
            >
              <StarIcon
                className={`h-6 w-6 ${
                  i <= (hover || rating) ? "text-gold" : "text-line"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder={t("revPlaceholder")}
        className="mt-3 w-full rounded-xl border border-line bg-canvas px-3.5 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-gold"
      />

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="mt-3 inline-flex h-11 items-center rounded-full bg-gold px-6 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep disabled:opacity-60"
      >
        {busy
          ? t("revSending")
          : state === "reviewed"
            ? t("revUpdate")
            : t("revSubmit")}
      </button>
    </div>
  );
}
