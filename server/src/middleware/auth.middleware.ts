//auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../types/jwt";

// Middleware function to authenticate JWT token
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get the authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present
  if (!authHeader) {
    console.log("No auth header");
    return res.sendStatus(401);
  }

  // Extract the token from the authorization header
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    console.log("Invalid auth format");
    return res.sendStatus(401);
  }

  // Get the secret key from the environment variables
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined");
  }

  // Verify the JWT token
  try {
    const decoded = jwt.verify(token, secretKey) as AuthPayload;
    console.log("Token verified successfully");

    // Attach the user information to the request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };

    next(); // Call the next middleware function
  } catch (err) {
    console.log("Token verification failed:", err);
    return res.sendStatus(403);
  }
};
