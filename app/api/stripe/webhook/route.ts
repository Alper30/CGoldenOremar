import { NextRequest, NextResponse, after } from "next/server";
import type Stripe from "stripe";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { notifyOrderPaid } from "@/lib/notify";

// Stripe webhook — ödemenin OTORİTATİF kaynağı. Sipariş yaşam döngüsünün
// tüm terminal durumlarını (ödendi / iptal / iade) siparişe ve escrow'a yansıtır.
//
// Güvence katmanları:
//  1) Ham gövde + imza doğrulaması → sahte istek reddedilir.
//  2) event.id defteri (payment_webhook_events) → aynı event iki kez işlenmez.
//     Claim önce yazılır; işleme patlarsa claim silinir ki Stripe retry'da tekrar denesin.
//  3) Tutar savunması + payment_status guard → çift/uyuşmaz ödeme yazılmaz.
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
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch (err) {
    console.error("[stripe-webhook] imza doğrulanamadı:", err);
    return NextResponse.json({ error: "Geçersiz imza" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    // Service-role yoksa siparişi güncelleyemeyiz → 500 dön ki Stripe tekrar denesin.
    console.error("[stripe-webhook] SERVICE_ROLE yok; işleme atlandı:", event.id);
    return NextResponse.json({ error: "Sunucu yapılandırması eksik" }, { status: 500 });
  }

  // İdempotency claim: bu event daha önce işlendiyse (23505) tekrar işleme.
  const orderIdHint = extractOrderId(event);
  const { error: claimErr } = await admin
    .from("payment_webhook_events")
    .insert({ event_id: event.id, type: event.type, order_id: orderIdHint });
  if (claimErr) {
    if (claimErr.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("[stripe-webhook] claim hatası:", claimErr.message);
    return NextResponse.json({ error: "claim başarısız" }, { status: 500 });
  }

  try {
    await handleEvent(admin, event);
  } catch (err) {
    // İşleme hatası → claim'i geri al ki Stripe retry'da yeniden işlensin.
    await admin.from("payment_webhook_events").delete().eq("event_id", event.id);
    console.error("[stripe-webhook] işleme hatası:", err);
    return NextResponse.json({ error: "işleme başarısız" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

type Admin = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

async function handleEvent(admin: Admin, event: Stripe.Event) {
  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata?.order_id;
      if (!orderId) return;

      // Savunma derinliği: tutar siparişin grand_total'ı ile eşleşmeli.
      const { data: ord } = await admin
        .from("orders")
        .select("grand_total, payment_status")
        .eq("id", orderId)
        .single();
      if (ord && pi.amount !== Math.round(Number(ord.grand_total) * 100)) {
        // Uyuşmaz tutar → finalize etme; claim kaydı kalır, 200 döneriz (retry döngüsü açmaz).
        console.error("[stripe-webhook] tutar uyuşmuyor; finalize atlandı:", orderId);
        return;
      }
      if (ord?.payment_status === "paid") return; // zaten ödendi (confirm ucu / önceki teslim)

      const { error } = await admin.rpc("finalize_order_payment", {
        p_order_id: orderId,
        p_provider: "stripe",
        p_ref: pi.id,
      });
      if (error) throw new Error(`finalize: ${error.message}`); // gerçek DB hatası → retry

      // Sipariş onay e-postaları: yanıt GÖNDERİLDİKTEN sonra çalışır → webhook'un
      // Stripe timeout/retry'ına takılmaz (best effort; hata ödemeyi etkilemez).
      after(() => notifyOrderPaid(orderId));
      return;
    }

    case "payment_intent.canceled": {
      // İptal edilen intent terminal'dir (retry yok) → siparişi kalıcı başarısız/iptal yap.
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata?.order_id;
      if (!orderId) return;
      const { error } = await admin.rpc("mark_order_failed", {
        p_order_id: orderId,
        p_ref: pi.id,
      });
      if (error) throw new Error(`mark_failed: ${error.message}`);
      return;
    }

    case "charge.refunded": {
      // İade (tam/kısmi) → siparişi 'refunded' işaretle + escrow'da bekleyen kalemleri
      // dondur (satıcıya serbest bırakılmasını engelle). Charge'ın PaymentIntent'i
      // üzerinden orders.payment_ref ile eşleştirilir.
      const ch = event.data.object as Stripe.Charge;
      const piId = typeof ch.payment_intent === "string" ? ch.payment_intent : ch.payment_intent?.id;
      if (!piId) return;
      const { error } = await admin.rpc("refund_order", { p_ref: piId });
      if (error) throw new Error(`refund: ${error.message}`);
      return;
    }

    case "payment_intent.payment_failed": {
      // RETRY-GÜVENLİ: intent açık kalır, kullanıcı aynı intent'te kartı yeniden
      // deneyebilir. Kalıcı durum değiştirme — yalnız gözlemlenebilirlik için logla.
      const pi = event.data.object as Stripe.PaymentIntent;
      console.warn(
        "[stripe-webhook] ödeme denemesi başarısız:",
        pi.metadata?.order_id,
        pi.last_payment_error?.message,
      );
      return;
    }

    default:
      // İlgilenmediğimiz event → claim'i kalır (tekrar teslimlerde no-op), sessiz geç.
      return;
  }
}

// Event tipine göre siparişi işaret et (defter kaydı için; işleme mantığı handleEvent'te).
function extractOrderId(event: Stripe.Event): string | null {
  if (event.type.startsWith("payment_intent.")) {
    const pi = event.data.object as Stripe.PaymentIntent;
    return pi.metadata?.order_id ?? null;
  }
  return null;
}
