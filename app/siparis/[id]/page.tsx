import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSnapshot } from "@/lib/auth";
import { fetchOrder } from "@/lib/orders";
import { OrderCard, type AnyOrder } from "@/components/OrderCard";
import { OrderReturnHandler } from "@/components/OrderReturnHandler";

export const metadata = { title: "Sipariş · Golden Oremar" };

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    yeni?: string;
    payment_intent?: string;
    redirect_status?: string;
  }>;
}) {
  const { id } = await params;
  const { yeni, payment_intent, redirect_status } = await searchParams;
  const { user } = await getAuthSnapshot();
  if (!user) redirect("/giris");

  const order = await fetchOrder(id);
  if (!order) redirect("/hesabim");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:py-14">
      {yeni ? (
        <OrderReturnHandler
          orderId={order.id}
          paymentStatus={order.payment_status}
          paymentIntent={payment_intent}
          redirectStatus={redirect_status}
        />
      ) : (
        <div className="mb-6">
          <Link href="/hesabim" className="text-sm font-semibold text-muted hover:text-gold">
            ← Siparişlerim
          </Link>
        </div>
      )}
      <OrderCard order={order as unknown as AnyOrder} />
    </div>
  );
}
