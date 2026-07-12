import "server-only";
import type { PaymentProvider, ProviderName } from "./types";
import { stripeProvider } from "./stripe";

// Sağlayıcı çözümleyici — ödeme rotaları sağlayıcıyı ada göre buradan alır.
// iyzico eklenince: iyzicoProvider'ı ./iyzico.ts içinde PaymentProvider'ı
// uygulayacak şekilde yazıp aşağıdaki haritaya ekleyin — çağıran kod değişmez.
// Varsayılan sağlayıcı ve yurt içi/dışı yönlendirme kararı CLAUDE.md §8.7'de.

const providers: Partial<Record<ProviderName, PaymentProvider>> = {
  stripe: stripeProvider,
  // iyzico: iyzicoProvider,  // TODO(§8.3): submerchant/split + taksit ile ekle
};

export const DEFAULT_PROVIDER: ProviderName = "stripe";

export function resolveProvider(name: ProviderName = DEFAULT_PROVIDER): PaymentProvider {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`payment_provider_not_implemented: ${name}`);
  }
  return provider;
}

export type { PaymentProvider, ProviderName } from "./types";
