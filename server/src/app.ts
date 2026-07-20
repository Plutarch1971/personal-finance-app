//app.ts
import express from "express";
import cors from "cors";
import routes from "./routes";
import webhookRoutes from "./routes/webhook.routes";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Stripe webhook must receive the raw body
app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookRoutes,
);

// JSON parser for all other routes
app.use(express.json());

app.use("/api", routes);

export default app;
