//subscription.middleware.ts
import { Request, Response, NextFunction } from "express";
import { User } from "../models";
import { SUBSCRIPTION_STATUS } from "../constants/subscription";

export async function verifySubscription(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Paid subscriber
    if (user.subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE) {
      return next();
    }

    // Free trial still active
    if (
      user.subscriptionStatus === SUBSCRIPTION_STATUS.TRIAL &&
      user.trialEndDate &&
      user.trialEndDate > new Date()
    ) {
      return next();
    }

    // Trial expired or subscription inactive
    return res.status(403).json({
      message:
        "Your trial has expired, Please subscribe to continue using SmartBooks.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}
