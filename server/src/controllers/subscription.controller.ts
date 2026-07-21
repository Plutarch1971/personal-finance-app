//subscription.controller.ts
import { Request, Response } from "express";
import * as subscriptionService from "../services/subscription.service";

class SubscriptionExistsError extends Error {}

export async function createCheckoutSession(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { plan } = req.body;

    if (plan !== "monthly" && plan !== "yearly") {
      return res.status(400).json({
        message: "Invalid subscription plan",
      });
    }

    const url = await subscriptionService.createCheckoutSession(
      req.user.id,
      req.user.email,
      plan,
    );

    return res.json({ url });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "You already have an active subscription."
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Unable to create checkout session",
    });
  }
}
