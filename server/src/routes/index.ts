import { Router } from "express";
import userRoutes from "./user.routes";
import accountRoutes from "./account.routes";
import categoryRoutes from "./category.routes";
import transactionRoutes from "./transaction.routes";
import reportRoutes from "./report.routes";
import receiptRoutes from "./receipt.routes";
import authRoutes from "./auth.routes";
import budgetRoutes from "./budget.routes";
import subscriptionRoutes from "./subscription.routes";

const router = Router();
// Add routes here
router.use("/users", userRoutes);
router.use("/accounts", accountRoutes);
router.use("/categories", categoryRoutes);
router.use("/transactions", transactionRoutes);
router.use("/reports", reportRoutes);
router.use("/receipts", receiptRoutes);
router.use("/auth", authRoutes);
router.use("/", budgetRoutes);
router.use("/subscriptions", subscriptionRoutes);

export default router;
