//customerPortal.controller.ts
import { Request, Response } from "express";
import * as portalService from "../services/customerPortal.service";

export async function createCustomerPortalSession(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const url = await portalService.createCustomerPortalSession(userId);
    return res.json({ url });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to open Customer Portal",
    });
  }
}
