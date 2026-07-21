//webhook.service.ts
import Stripe from "stripe";
import { User } from "../models/user";

export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;

      if (!userId) {
        console.error("Missing userId in metadata.");
        return;
      }

      const stripeCustomerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      const [updatedRows] = await User.update(
        {
          subscriptionStatus: "active",
          stripeCustomerId,
          subscriptionId,
        },
        {
          where: { id: userId },
        },
      );

      if (updatedRows === 0) {
        console.error(`User ${userId} not found`);
      }

      console.log(`Activated subscriptioin for the user: ${userId}`);

      break;
    }

    case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("Subscription update:", subscription.id);
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }
}
