//AuthContext.tsx
import { useState, useCallback, useMemo } from "react";
import { AuthContext, type AuthUser } from "../context/auth-context";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      return null;
    }
  });

  const login = useCallback(
    (token: string, userData: AuthUser | null = null) => {
      localStorage.setItem("token", token);
      setToken(token);

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
    },
    [],
  );

  const updateUser = useCallback((userData: AuthUser) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

    const value = useMemo(
  () => ({
    token,
    user,
    login,
    logout,
    updateUser,
  }),
  [token, user, login, logout, updateUser]
);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
