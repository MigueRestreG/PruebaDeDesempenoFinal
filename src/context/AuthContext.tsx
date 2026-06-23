"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { UserSession } from "@/types";
import { apiFetch } from "@/lib/api";

type AuthContextValue = {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, lastName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: UserSession | null }>("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ user: UserSession }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
  }, []);

  const register = useCallback(async (name: string, lastName: string, email: string, password: string, confirmPassword: string) => {
    const data = await apiFetch<{ user: UserSession }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, lastName, email, password, confirmPassword }),
    });
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await apiFetch<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, refreshSession }),
    [user, isLoading, login, register, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }
  return context;
}
