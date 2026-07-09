//user.service.ts
import { User, Category, Account } from "../models";
import { AccountType } from "../models/accounts";
import sequelize from "../config/connection";
import { DEFAULT_CATEGORIES } from "../constants/categories";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendPasswordResetEmail } from "./email.service";
import { SUBSCRIPTION_STATUS } from '../constants/subscription';

// Default accounts for new users
const DEFAULT_ACCOUNTS: {
  name: string;
  type: AccountType;
  currency: "CAD";
  balance: number;
}[] = [
  { name: "Checking Account", type: "checking", currency: "CAD", balance: 0 },
  { name: "Savings Account", type: "savings", currency: "CAD", balance: 0 },
  { name: "Credit Card", type: "credit", currency: "CAD", balance: 0 },
  //Investment Accounts
  { name: "TFSA", type: "investment", currency: "CAD", balance: 0 },
  { name: "RRSP", type: "investment", currency: "CAD", balance: 0 },
  { name: "RESP", type: "investment", currency: "CAD", balance: 0 },
  { name: "Bonds", type: "investment", currency: "CAD", balance: 0 },
  { name: "Stocks", type: "investment", currency: "CAD", balance: 0 },
  { name: "GIC", type: "investment", currency: "CAD", balance: 0 },
];

// TODO: Implement user creation logic
export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  return sequelize.transaction(async (t) => {
    const hash = await bcrypt.hash(data.password, 10);

    const normalizedEmail = data.email.trim().toLowerCase();
    
    const existing = await User.findOne({
      where: { email: normalizedEmail },
      transaction: t,
    });
    if (existing) throw new Error("Email already registered.");

    // Create 14-day trial
    const trialStartDate = new Date();

    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() +14);

    const user = await User.create(
      {
        username: data.username.trim(),
        email: normalizedEmail,
        passwordHash: hash,

        trialStartDate,
        trialEndDate,

        subscriptionStatus: SUBSCRIPTION_STATUS.TRIAL, 

        subscriptionId: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      },
      { transaction: t },
    );

    // Create default categories with parent-child relationships
    // First pass: create all parent categories (where parent is null)
    const categoryMap = new Map<string, string>(); // Maps category name to ID

    // Create parent categories first
    const parentCategories = DEFAULT_CATEGORIES.filter(
      (cat) => cat.parent === null,
    );
    for (const cat of parentCategories) {
      const created = await Category.create(
        {
          userId: user.id,
          name: cat.name,
          type: cat.type as "income" | "expense",
          parentId: null,
        },
        { transaction: t },
      );
      categoryMap.set(cat.name, created.id);
    }

    // Create child categories with parentId
    const childCategories = DEFAULT_CATEGORIES.filter(
      (cat) => cat.parent !== null,
    );
    for (const cat of childCategories) {
      const parentId = categoryMap.get(cat.parent!);
      if (parentId) {
        await Category.create(
          {
            userId: user.id,
            name: cat.name,
            type: cat.type as "income" | "expense",
            parentId: parentId,
          },
          { transaction: t },
        );
      }
    }

    for (const acc of DEFAULT_ACCOUNTS) {
      await Account.findOrCreate({
        where: { userId: user.id, name: acc.name },
        defaults: {
          userId: user.id,
          name: acc.name,
          type: acc.type,
          currency: acc.currency,
          initialBalance: acc.balance,
          balance: acc.balance,
        },
        transaction: t,
      });
    }
    return user;
  });
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ where: { email } });

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid password");

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("No secret key defined");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    secretKey,
    { expiresIn: "1d" },
  );

  return { user, token };
}

//---------------------------FORGOT PASSWORD SERVICE ----------------------
export const forgotPassword = async (email: string): Promise<void> => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");

  console.log("Generated token:", token);

  user.resetPasswordToken = token;

  user.resetPasswordExpires = new Date(Date.now() + 3600000);

  await user.save();

  console.log("Saved token:", user.resetPasswordToken);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  try {
    await sendPasswordResetEmail(user.email, resetLink);
  } catch (error) {
    console.error("Email send failed", error);
  }
  return;
};

//--------------------------- RESET PASSWORD SERVICE-------------------
export const resetPassword = async (
  token: string,
  password: string,
): Promise<void> => {
  console.log("Backend token:", token);

  const user = await User.findOne({
    where: {
      resetPasswordToken: token,
    },
  });

  console.log("User found:", !!user);

  if (!user) {
    throw new Error("INVALID_TOKEN");
  }

  if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new Error("TOKEN_EXPIRED");
  }

  const hash = await bcrypt.hash(password, 10);
  user.passwordHash = hash;

  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();
};
