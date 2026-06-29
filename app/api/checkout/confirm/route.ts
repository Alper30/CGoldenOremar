import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { stripe, stripeEnabled } from "@/lib/stripe";

// Ödemeyi SUNUCUDA doğrular, sonra mark_order_paid RPC'siyle siparişi öder.
// (Canlıda webhook ile sağlamlaştırılacak; test akışı için PaymentIntent doğrulaması.)
export async function POST(req: NextRequest) {
  const { orderId, paymentIntentId } = await req.json().catch(() => ({}));
  if (!orderId) return NextResponse.json({ error: "orderId gerekli" }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });

  const { data: order } = await supabase
    .from("orders")
    .select("id, grand_total, payment_status, buyer_id")
    .eq("id", orderId)
    .single();

  if (!order || order.buyer_id !== user.id || order.payment_status !== "pending") {
    return NextResponse.json({ error: "Geçersiz sipariş" }, { status: 400 });
  }

  let ref: string;
  if (stripeEnabled && stripe) {
    // Stripe yapılandırılmışsa ödeme ZORUNLU doğrulanır — paymentIntentId olmadan
    // "ödendi" yapılamaz (bypass engeli).
    if (!paymentIntentId) {
      return NextResponse.json({ error: "Ödeme doğrulanamadı" }, { status: 400 });
    }
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status !== "succeeded") {
      return NextResponse.json({ error: "Ödeme tamamlanmadı" }, { status: 400 });
    }
    if (pi.amount !== Math.round(Number(order.grand_total) * 100)) {
      return NextResponse.json({ error: "Tutar uyuşmuyor" }, { status: 400 });
    }
    // PaymentIntent yeniden kullanım engeli: intent bu siparişe ait olmalı.
    if (pi.metadata?.order_id !== orderId) {
      return NextResponse.json({ error: "Ödeme bu siparişe ait değil" }, { status: 400 });
    }
    ref = pi.id;
  } else {
    // Stripe anahtarı hiç yoksa yalnızca geliştirme/test ortamında mock onay.
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Ödeme yapılandırılmamış" }, { status: 503 });
    }
    ref = "mock";
  }

  const { error } = await supabase.rpc("mark_order_paid", {
    p_order_id: orderId,
    p_provider: "stripe",
    p_ref: ref,
    p_secret: process.env.PAYMENT_SECRET ?? "",
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
