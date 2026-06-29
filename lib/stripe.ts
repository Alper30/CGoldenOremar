import "server-only";
import Stripe from "stripe";

// Sunucu-tarafı Stripe istemcisi. Secret key yoksa null → mock/test akışı.
const key = process.env.STRIPE_SECRET_KEY;

export const stripeEnabled = Boolean(key);
export const stripe = key ? new Stripe(key) : null;
