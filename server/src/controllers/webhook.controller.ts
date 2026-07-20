//webhook.controller.ts
import { Request, Response } from "express";
import Stripe from "stripe";
//import * as webhookService from '../services/webhook.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function stripeWebhook(req: Request, res: Response) {
  try {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).send("Missing Stripe signature.");
    }
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
    console.log("✅Stripe event received", event.type);
    console.log("Event:", event.type);

    return res.status(200).json({
      receive: true,
    });
  } catch (error) {
    console.error("Webhook verification failed", error);
    return res.status(400).send("Webhook error");
  }

  //await webhookService.handleWebhookEvent(event);
}
