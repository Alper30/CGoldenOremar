import "server-only";
import type { Database } from "@/lib/database.types";

// Ödeme sağlayıcı soyutlaması (CLAUDE.md §8.3).
// Amaç: Stripe ve iyzico'yu tek arayüz ardında değiştirilebilir kılmak.
// Şu an yalnızca Stripe implemente (bkz. ./stripe.ts); iyzico bu arayüzü
// uygulayan bir adaptör eklenerek tak-çalıştır bağlanacak (bkz. ./index.ts).
//
// NOT: Mevcut checkout rotaları (app/api/checkout/*, app/api/stripe/webhook)
// hâlâ doğrudan lib/stripe.ts kullanıyor ve çalışıyor. Bu katman, iyzico
// eklenirken o rotaların bu arayüze taşınması için hazır seam'dir.

export type ProviderName = Database["public"]["Enums"]["payment_provider"]; // "stripe" | "iyzico"

// Tüm para birimleri en küçük birimde (kuruş) — Stripe ile birebir, yuvarlama yok.
export type CreateIntentInput = {
  orderId: string;
  amountKurus: number;
  currency: string; // "try"
  /** 3DS/redirect sonrası dönülecek mutlak URL (sağlayıcıya göre kullanılır). */
  returnUrl?: string;
};

export type CreateIntentResult = {
  provider: ProviderName;
  /** Sağlayıcı tarafındaki ödeme referansı (Stripe: PaymentIntent id). */
  ref: string;
  /** İstemci onayı için (Stripe PaymentElement clientSecret). */
  clientSecret?: string;
  /** Barındırılan ödeme/3DS sayfasına yönlendirme (iyzico akışı). */
  redirectUrl?: string;
};

export type VerifyInput = {
  ref: string;
  orderId: string;
  expectedAmountKurus: number;
};

export type VerifyResult = {
  paid: boolean;
  ref: string;
};

// Her sağlayıcı bu sözleşmeyi uygular.
export interface PaymentProvider {
  readonly name: ProviderName;
  readonly enabled: boolean;
  createIntent(input: CreateIntentInput): Promise<CreateIntentResult>;
  verify(input: VerifyInput): Promise<VerifyResult>;
}
