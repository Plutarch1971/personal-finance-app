//auth-context.ts
import { createContext } from "react";

export interface AuthUser {
  id?: string;
  username?: string;
  email?: string;
  trialEndDate?: string | null;
  subscriptionStatus?: string;
}

export interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user?: AuthUser | null) => void;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);