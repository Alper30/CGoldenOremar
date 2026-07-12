"use client";

import { useEffect, useRef } from "react";
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
  // Yalnızca Stripe açıkça "başarısız" derse (redirect_status=failed) başarısızlık
  // göster; diğer tüm durumlarda gerçeğin kaynağı sunucudaki payment_status'tur.
  const failed = redirectStatus === "failed";

  useEffect(() => {
    // failed başlangıç değeri redirect_status=failed durumunu zaten kapsar.
    if (paid || failed || done.current) return;
    if (!paymentIntent) return; // doğrulanacak bir ödeme referansı yok
    done.current = true;
    (async () => {
      // confirm sonucu ne olursa olsun sayfayı tazele → ödeme durumunun TEK
      // kaynağı sunucudaki payment_status'tur. Böylece webhook bizden önce
      // siparişi 'paid' yaptıysa (yarış durumu) confirm 400 dönse bile yanlış
      // "başarısız" gösterilmez; tazelenen sayfa 'paid' ise banner çıkar.
      try {
        await fetch("/api/checkout/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, paymentIntentId: paymentIntent }),
        });
      } catch {
        // ağ hatası — yine de tazele; webhook ödemeyi sonuçlandırmış olabilir.
      }
      router.refresh();
    })();
  }, [paid, failed, paymentIntent, orderId, router]);

  // Webhook confirm'den birkaç saniye sonra gelebilir (3DS/async ödeme). Hâlâ
  // "doğrulanıyor" durumundaysak sınırlı sayıda otomatik tazele → kullanıcı elle
  // yenilemeden 'paid'e geçişi görür. En fazla ~6 deneme (18sn), sonra durur.
  useEffect(() => {
    if (paid || failed || !paymentIntent) return;
    let tries = 0;
    const id = setInterval(() => {
      if (++tries > 6) {
        clearInterval(id);
        return;
      }
      router.refresh();
    }, 3000);
    return () => clearInterval(id);
  }, [paid, failed, paymentIntent, router]);

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
