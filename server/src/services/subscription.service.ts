//subscription.service.ts
import Stripe from "stripe";
import { User } from "../models/user";

class SubscriptionExistsError extends Error {}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

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

  if (user.subscriptionStatus === "active" && user.subscriptionId) {
    throw new SubscriptionExistsError("You alredy have an active subscriptioin");
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
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

  if (user.stripeCustomerId) {
    sessionParams.customer = user.stripeCustomerId;
  } else {
    sessionParams.customer_email = email;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return session.url;
}
