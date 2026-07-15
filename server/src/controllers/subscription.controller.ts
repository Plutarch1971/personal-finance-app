//subscription.controller.ts
import { Request, Response } from "express";
import * as subscriptionService from "../services/subscription.service";

export async function createCheckoutSession(req: Request, res: Response) {
  try {
    const { plan } = req.body;

    if (plan !== "monthly" && plan !== "yearly") {
      return res.status(400).json({
        message: "Invalid subscription plan",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const checkoutUrl = await subscriptionService.createCheckoutSession(
      req.user.id,
      req.user.email,
      plan,
    );

    return res.json({
      url: checkoutUrl,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to create checkout session",
    });
  }
}
