"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "./store";
import { OrderSuccessBanner } from "./OrderSuccessBanner";
import { VerifiedIcon } from "./icons";

// 3D Secure dönüşünü ele alır. Stripe, return_url'e payment_intent + redirect_status
// ekler. Ödeme henüz 'paid' değilse, /api/checkout/confirm'i çağırıp (PI SUNUCUDA
// doğrulanır) sayfayı tazeler → escrow tetiklenir. Banner YALNIZCA gerçekten
// ödendiğinde gösterilir (eskiden ?yeni=1 ile koşulsuz gösteriliyordu).
export function OrderReturnHandler({
  orderId,
  paymentStatus,
  paymentIntent,
  redirectStatus,
}: {
  orderId: string;
  paymentStatus: string;
  paymentIntent?: string;
  redirectStatus?: string;
}) {
  const paid = paymentStatus === "paid";
  const { t } = useStore();
  const router = useRouter();
  const done = useRef(false);
  const [failed, setFailed] = useState(redirectStatus === "failed");

  useEffect(() => {
    // failed başlangıç değeri redirect_status=failed durumunu zaten kapsar.
    if (paid || failed || done.current) return;
    if (!paymentIntent) return; // doğrulanacak bir ödeme referansı yok
    done.current = true;
    (async () => {
      try {
        const res = await fetch("/api/checkout/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, paymentIntentId: paymentIntent }),
        });
        if (res.ok) router.refresh();
        else setFailed(true);
      } catch {
        setFailed(true);
      }
    })();
  }, [paid, failed, paymentIntent, orderId, router]);

  if (paid) return <OrderSuccessBanner orderId={orderId} />;

  if (failed) {
    return (
      <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-7 text-center">
        <h1 className="font-display text-2xl text-forest-deep">{t("coPayFailed")}</h1>
        <p className="mt-1.5 text-muted">{t("coPayFailedSub")}</p>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-bg p-7 text-center">
      <span className="mx-auto flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-gold/20 text-gold-deep">
        <VerifiedIcon className="h-6 w-6" />
      </span>
      <h1 className="mt-4 font-display text-xl text-forest-deep">{t("coVerifying")}</h1>
      <p className="mt-1.5 text-sm text-muted">{t("coVerifyingSub")}</p>
    </div>
  );
}
