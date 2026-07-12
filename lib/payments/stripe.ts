import "server-only";
import { stripe, stripeEnabled } from "@/lib/stripe";
import type {
  PaymentProvider,
  CreateIntentInput,
  CreateIntentResult,
  VerifyInput,
  VerifyResult,
} from "./types";

// Stripe adaptörü — mevcut lib/stripe.ts istemcisini PaymentProvider
// arayüzüne sarar. Davranış app/api/checkout/* ile tutarlıdır: tutar sunucuda
// belirlenir, idempotency order_<id> ile sağlanır, doğrulama server-side yapılır.

export const stripeProvider: PaymentProvider = {
  name: "stripe",
  enabled: stripeEnabled,

  async createIntent(input: CreateIntentInput): Promise<CreateIntentResult> {
    if (!stripe) throw new Error("stripe_disabled");
    const intent = await stripe.paymentIntents.create(
      {
        amount: input.amountKurus,
        currency: input.currency,
        automatic_payment_methods: { enabled: true },
        metadata: { order_id: input.orderId },
      },
      { idempotencyKey: `order_${input.orderId}` },
    );
    return {
      provider: "stripe",
      ref: intent.id,
      clientSecret: intent.client_secret ?? undefined,
    };
  },

  async verify(input: VerifyInput): Promise<VerifyResult> {
    if (!stripe) throw new Error("stripe_disabled");
    const intent = await stripe.paymentIntents.retrieve(input.ref);
    const paid =
      intent.status === "succeeded" &&
      intent.amount === input.expectedAmountKurus &&
      intent.metadata?.order_id === input.orderId;
    return { paid, ref: intent.id };
  },
};
