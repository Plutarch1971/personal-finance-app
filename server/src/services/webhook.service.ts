//webhook.service.ts
import Stripe from "stripe";
import { User } from "../models/user";
import { SUBSCRIPTION_STATUS } from "../constants/subscription";

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

      console.log("=== CHECKOUT SESSION COMPLETED ===");
      console.log("userId:", userId);
      console.log("customer:", stripeCustomerId);
      console.log("subscription:", subscriptionId);

      const [updatedRows] = await User.update(
        {
          subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
          stripeCustomerId,
          subscriptionId,
        },
        {
          where: { id: userId },
        },
      );

      console.log("Rows updated:", updatedRows);

      if (updatedRows === 0) {
        console.error(`User ${userId} not found`);
      }

      console.log(`Activated subscription for the user: ${userId}`);

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      console.log(
        "Subscription update:",
        subscription.id,
        "Status:",
        subscription.status,
      );

      let subscriptionStatus: string;

      switch (subscription.status) {
        case "active":
        case "trialing":
          subscriptionStatus = SUBSCRIPTION_STATUS.ACTIVE;
          break;

        case "past_due":
          subscriptionStatus = SUBSCRIPTION_STATUS.PAST_DUE;
          break;

        case "canceled":
          subscriptionStatus = SUBSCRIPTION_STATUS.CANCELLED;
          break;

        case "unpaid":
          subscriptionStatus = SUBSCRIPTION_STATUS.INACTIVE;
          break;

        default:
          subscriptionStatus = SUBSCRIPTION_STATUS.INACTIVE;
      }

      let [updatedRows] = await User.update(
        { subscriptionStatus },
        {
          where: {
            subscriptionId: subscription.id,
          },
        },
      );

      if (updatedRows === 0) {
        [updatedRows] = await User.update(
          { subscriptionStatus, subscriptionId: subscription.id },
          {
            where: {
              stripeCustomerId: subscription.customer as string,
            },
          },
        );
      }

      if (updatedRows === 0) {
        console.warn(`No user found with subscriptionId: ${subscription.id}`);
      }
      console.log("Rows updated by subscription update:", updatedRows);

      console.log(
        `Subscription ${subscription.id} updated to ${subscriptionStatus}`,
      );

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      console.log("=== SUBSCRIPTION DELETED ===");
      console.log("subscription:", subscription.id);
      console.log("customer:", subscription.customer);

      console.log("Subscription deleted:", subscription.id);

      console.log("Looking up by subscriptionId:", subscription.id);

      let [updatedRows] = await User.update(
        {
          subscriptionStatus: SUBSCRIPTION_STATUS.CANCELLED,
          subscriptionId: null,
        },
        {
          where: {
            subscriptionId: subscription.id,
          },
        },
      );

      console.log("Rows updated by subscriptionId:", updatedRows);

      if (updatedRows === 0) {
        console.log("Looking up by customer:", subscription.customer);

        [updatedRows] = await User.update(
          {
            subscriptionStatus: SUBSCRIPTION_STATUS.CANCELLED,
            subscriptionId: null,
          },
          {
            where: {
              stripeCustomerId: subscription.customer as string,
            },
          },
        );

        console.log("Rows updated by customer:", updatedRows);
      }

      if (updatedRows === 0) {
        console.warn(
          `No user found for deleted subscription ${subscription.id}`,
        );
      }
      console.log(`Subscription ${subscription.id} cancelled.`);
     
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;

      await User.update(
        {
          subscriptionStatus: SUBSCRIPTION_STATUS.PAST_DUE,
        },
        {
          where: {
            stripeCustomerId: invoice.customer as string,
          },
        },
      );

      console.log(`Payment failed for customer ${invoice.customer}`);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;

      const customerId = invoice.customer as string;

      const [updatedRows] = await User.update(
        {
          subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
        },
        {
          where: {
            stripeCustomerId: customerId,
          },
        },
      );

      if (updatedRows === 0) {
        console.warn(`No user found for paid invoice customer ${customerId}`);
      }

      console.log(
        `Invoice paid. Customer ${customerId} subscription set to active.`,
      );

      break;
    }
    default:
      console.log(`Unhandled event: ${event.type}`);
  }
}
