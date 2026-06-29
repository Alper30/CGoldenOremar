import { NextRequest, NextResponse } from "next/server";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Stripe webhook — siparişin ÖDENDİĞİNİN otoritatif kaynağı.
// 3D Secure'de tarayıcı return_url'e yönlenir ve istemci onFinalize'ı bazen
// çalıştıramaz (kullanıcı sekmeyi kapatır vb.). Webhook bu boşluğu kapatır:
// payment_intent.succeeded → siparişi service-role ile 'paid' yapar (idempotent).
//
// Stripe ham gövde + imza ile doğrulanır → sahte istek kabul edilmez.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!stripeEnabled || !stripe) {
    return NextResponse.json({ error: "Stripe yapılandırılmamış" }, { status: 503 });
  }
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!whSecret) {
    return NextResponse.json({ error: "Webhook sırrı yok" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "İmza yok" }, { status: 400 });

  const body = await req.text(); // ham gövde — imza doğrulaması için zorunlu
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch (err) {
    console.error("[stripe-webhook] imza doğrulanamadı:", err);
    return NextResponse.json({ error: "Geçersiz imza" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    const orderId = pi.metadata?.order_id;
    if (orderId) {
      const admin = createSupabaseAdminClient();
      if (!admin) {
        // service-role anahtarı yoksa onaylayamayız → Stripe'a 500 dön ki tekrar denesin.
        console.error("[stripe-webhook] SERVICE_ROLE yok; finalize atlandı:", orderId);
        return NextResponse.json({ error: "Sunucu yapılandırması eksik" }, { status: 500 });
      }
      const { error } = await admin.rpc("finalize_order_payment", {
        p_order_id: orderId,
        p_provider: "stripe",
        p_ref: pi.id,
      });
      if (error) {
        console.error("[stripe-webhook] finalize hatası:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
