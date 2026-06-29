import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { stripe, stripeEnabled } from "@/lib/stripe";

// Sipariş için Stripe PaymentIntent oluşturur. Tutar SUNUCUDA, veritabanındaki
// sipariş kaydından okunur — istemci tutarına asla güvenilmez.
export async function POST(req: NextRequest) {
  const { orderId } = await req.json().catch(() => ({}));
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

  if (!stripeEnabled || !stripe) {
    // Test/mock modu: gerçek anahtar yokken sipariş akışı devam edebilsin.
    return NextResponse.json({ mock: true });
  }

  // idempotencyKey: aynı sipariş için tekrar çağrıda yeni PaymentIntent üretilmez
  // (state drift / çoğalan intent engeli).
  const pi = await stripe.paymentIntents.create(
    {
      amount: Math.round(Number(order.grand_total) * 100),
      currency: "try",
      metadata: { order_id: order.id, buyer_id: user.id },
      automatic_payment_methods: { enabled: true },
    },
    { idempotencyKey: `order_${order.id}` },
  );

  return NextResponse.json({ clientSecret: pi.client_secret, mock: false });
}
