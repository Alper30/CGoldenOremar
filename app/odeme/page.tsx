"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useStore } from "@/components/store";
import { useCatalog } from "@/components/CatalogProvider";
import { useAuth } from "@/components/AuthProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { fmtPrice } from "@/lib/data";
import { ArrowRightIcon, ShieldIcon, CartIcon } from "@/components/icons";

const pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = pubKey ? loadStripe(pubKey) : null;

// Kargo eşiği/ücreti SUNUCUDAN (platform_settings) gelir; sabit kod yok.
// Bu değerler yalnız sipariş oluşmadan ÖNCEKİ tahmini özet içindir — kesin tutar
// create_order ile DB'de hesaplanıp `totals` olarak gelir ve bunların yerini alır.
const SHIP_FALLBACK = { threshold: 250, fee: 49.9 };

type Totals = { items: number; shipping: number; grand: number };

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useStore();
  const { signedIn } = useAuth();

  if (!signedIn) {
    return (
      <Notice
        title={t("coLoginRequired")}
        cta={{ href: "/giris", label: t("coGoLogin") }}
      />
    );
  }
  return <CheckoutInner router={router} />;
}

function CheckoutInner({
  router,
}: {
  router: ReturnType<typeof useRouter>;
}) {
  const { t, cart, clearCart, toast } = useStore();
  const { getProduct } = useCatalog();
  const { profile } = useAuth();

  const lines = cart
    .map((i) => ({ ...i, product: getProduct(i.slug) }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product!.price * l.qty, 0);

  const [ship, setShip] = useState(SHIP_FALLBACK);
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase
      .from("platform_settings")
      .select("free_shipping_threshold, shipping_fee")
      .eq("id", true)
      .single()
      .then(({ data }) => {
        if (data)
          setShip({
            threshold: Number(data.free_shipping_threshold),
            fee: Number(data.shipping_fee),
          });
      });
  }, []);
  const estShipping = subtotal >= ship.threshold || subtotal === 0 ? 0 : ship.fee;

  const [step, setStep] = useState<"address" | "pay">("address");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [form, setForm] = useState({
    name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    line: "",
    district: "",
    province: "",
  });

  if (lines.length === 0 && step === "address") {
    return (
      <Notice
        title={t("coEmptyCart")}
        cta={{ href: "/urunler", label: t("cartStart") }}
      />
    );
  }

  const upd = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function startCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const slugs = lines.map((l) => l.slug);
      const { data: prods, error: pErr } = await supabase
        .from("products")
        .select("id, slug")
        .in("slug", slugs)
        .eq("status", "published");
      if (pErr) throw pErr;

      const idBySlug = new Map((prods ?? []).map((p) => [p.slug, p.id]));
      const items = lines
        .map((l) => ({ product_id: idBySlug.get(l.slug), qty: l.qty }))
        .filter((i): i is { product_id: string; qty: number } => Boolean(i.product_id));
      if (items.length === 0) throw new Error("no-items");

      const { data: newOrderId, error: oErr } = await supabase.rpc("create_order", {
        p_items: items,
        p_ship: {
          name: form.name,
          phone: form.phone,
          line: form.line,
          district: form.district,
          province: form.province,
        },
      });
      if (oErr) throw oErr;

      const { data: order } = await supabase
        .from("orders")
        .select("items_total, shipping_total, grand_total")
        .eq("id", newOrderId as string)
        .single();

      setOrderId(newOrderId as string);
      if (order) {
        setTotals({
          items: Number(order.items_total),
          shipping: Number(order.shipping_total),
          grand: Number(order.grand_total),
        });
      }

      const res = await fetch("/api/checkout/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: newOrderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "intent");

      if (data.mock) {
        // Stripe anahtarsız test akışı: doğrudan onayla.
        await finalize(newOrderId as string, null);
        return;
      }
      setClientSecret(data.clientSecret);
      setStep("pay");
    } catch (err) {
      console.error("[checkout]", err);
      toast(t("coError"));
    } finally {
      setLoading(false);
    }
  }

  async function finalize(oid: string, paymentIntentId: string | null) {
    const res = await fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: oid, paymentIntentId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "confirm");
    clearCart();
    router.push(`/siparis/${oid}?yeni=1`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold">
        {t("coCheckout")}
      </p>
      <h1 className="mt-1 font-display text-3xl text-forest-deep sm:text-4xl">
        {t("coTitle")}
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* Sol: adres / ödeme */}
        <div>
          {step === "address" ? (
            <form
              onSubmit={startCheckout}
              className="rounded-3xl border border-line bg-card p-6"
            >
              <h2 className="font-display text-xl text-forest-deep">
                {t("coShipInfo")}
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label={t("coName")} value={form.name} onChange={upd("name")} required />
                <Field label={t("coPhone")} value={form.phone} onChange={upd("phone")} required />
                <div className="sm:col-span-2">
                  <Field label={t("coAddress")} value={form.line} onChange={upd("line")} required />
                </div>
                <Field label={t("coDistrict")} value={form.district} onChange={upd("district")} required />
                <Field label={t("coProvince")} value={form.province} onChange={upd("province")} required />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep disabled:opacity-60"
              >
                {loading ? t("coPaying") : t("coPay")}
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </form>
          ) : clientSecret && orderId ? (
            <div className="rounded-3xl border border-line bg-card p-6">
              <h2 className="font-display text-xl text-forest-deep">
                {t("coCardInfo")}
              </h2>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  locale: "tr",
                  appearance: { theme: "flat", variables: { colorPrimary: "#C9A961" } },
                }}
              >
                <PayForm
                  orderId={orderId}
                  onFinalize={finalize}
                  payLabel={t("coPay")}
                  payingLabel={t("coPaying")}
                  errorLabel={t("coError")}
                />
              </Elements>
              <p className="mt-3 text-xs text-muted">{t("coTestCard")}</p>
            </div>
          ) : null}

          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-bg px-4 py-3 text-sm text-gold-deep">
            <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0" />
            {t("coEscrowNote")}
          </div>
        </div>

        {/* Sağ: özet */}
        <aside className="h-fit rounded-3xl border border-line bg-card p-6">
          <h2 className="flex items-center gap-2 font-display text-xl text-forest-deep">
            <CartIcon className="h-5 w-5 text-gold" />
            {t("coSummary")}
          </h2>
          <div className="mt-4 space-y-3">
            {lines.map((l) => {
              const p = l.product!;
              return (
                <div key={l.slug} className="flex gap-3">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-canvas">
                    <Image src={p.image} alt={p.name} fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-forest-deep">
                      {p.name}
                    </span>
                    <span className="text-xs text-muted">
                      {l.qty} × {fmtPrice(p.price)}
                    </span>
                  </span>
                  <span className="font-display text-sm text-forest-deep">
                    {fmtPrice(p.price * l.qty)}
                  </span>
                </div>
              );
            })}
          </div>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <Line label={t("cartSubtotal")} value={fmtPrice(totals?.items ?? subtotal)} />
            <Line
              label={t("coShipping")}
              value={
                (totals?.shipping ?? estShipping) === 0
                  ? t("coFree")
                  : fmtPrice(totals?.shipping ?? estShipping)
              }
            />
            <div className="flex items-center justify-between border-t border-line pt-3">
              <dt className="font-semibold text-forest-deep">{t("coTotal")}</dt>
              <dd className="font-display text-xl text-forest-deep">
                {fmtPrice(totals?.grand ?? subtotal + estShipping)}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function PayForm({
  orderId,
  onFinalize,
  payLabel,
  payingLabel,
  errorLabel,
}: {
  orderId: string;
  onFinalize: (oid: string, pi: string | null) => Promise<void>;
  payLabel: string;
  payingLabel: string;
  errorLabel: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useStore();
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: { return_url: `${window.location.origin}/siparis/${orderId}?yeni=1` },
      });
      if (error) {
        toast(error.message || errorLabel);
        setSubmitting(false);
        return;
      }
      if (paymentIntent?.status === "succeeded") {
        await onFinalize(orderId, paymentIntent.id);
      } else {
        setSubmitting(false);
      }
    } catch (err) {
      console.error("[pay]", err);
      toast(errorLabel);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-5">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep disabled:opacity-60"
      >
        {submitting ? payingLabel : payLabel}
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-forest-deep">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="h-11 w-full rounded-xl border border-line bg-cream px-3.5 text-sm text-ink outline-none focus:border-gold"
      />
    </label>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-forest-deep">{value}</dd>
    </div>
  );
}

function Notice({
  title,
  cta,
}: {
  title: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-lg font-medium text-forest-deep">{title}</p>
      <Link
        href={cta.href}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-cream hover:bg-gold-deep"
      >
        {cta.label}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
