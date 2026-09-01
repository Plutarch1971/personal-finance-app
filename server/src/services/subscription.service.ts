//subscription.service.ts
import Stripe from "stripe";
import { User } from "../models/user";

export class SubscriptionExistsError extends Error {}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

console.log(
  "Stripe key prefix:",
  process.env.STRIPE_SECRET_KEY?.substring(0, 20),
);

export async function createCheckoutSession(
  userId: string,
  email: string,
  plan: "monthly" | "yearly",
) {
  const priceId =
    plan === "yearly"
      ? process.env.STRIPE_YEARLY_PRICE_ID
      : process.env.STRIPE_MONTHLY_PRICE_ID;

  if (!priceId) {
    throw new Error("Stripe Price ID is missing.");
  }

  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  console.log("========== CHECKOUT DEBUG ==========");
  console.log("User ID:", userId);
  console.log("Email:", email);
  console.log("DB Customer ID:", user.stripeCustomerId);
  console.log("Subscription Status:", user.subscriptionStatus);
  console.log("Subscription ID:", user.subscriptionId);
  console.log("Price ID:", priceId);
  console.log("===================================");

  if (user.subscriptionStatus === "active" && user.subscriptionId) {
    throw new SubscriptionExistsError(
      "You alredy have an active subscriptioin",
    );
  }


  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email, // force email for testing
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      plan,
    },
    success_url: `${process.env.FRONTEND_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/subscribe`,
  };

  // if (user.stripeCustomerId) {
  //   sessionParams.customer = user.stripeCustomerId;
  // } else {
  //   sessionParams.customer_email = email;
  // }

  console.log("Creating Stripe Checkout Session...");

  const session = await stripe.checkout.sessions.create(sessionParams);
  
  console.log("Checkout Session Created:", session.id);
  console.log("Checkout URL:", session.url);

  return session.url;
}
