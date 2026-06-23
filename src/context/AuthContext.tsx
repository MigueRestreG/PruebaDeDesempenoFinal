// Global authentication context for user state management
// Provides user data and auth methods (login/register/logout) to all client components
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { UserSession } from "@/types";
import { apiFetch } from "@/lib/api";

// Auth context type definition
type AuthContextValue = {
  user: UserSession | null; // Current authenticated user (null if logged out)
  isLoading: boolean; // Loading state during session verification
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, lastName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>; // Manually refresh auth state
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// AuthProvider component: wraps app to provide auth context
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify current session on mount (check if user already logged in via cookie)
  const refreshSession = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: UserSession | null }>("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null); // Invalid/expired token
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run on component mount: verify session from JWT cookie
  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  // Login handler: POST credentials and update local state
  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ user: UserSession }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
  }, []);

  // Register handler: create account and auto-login
  const register = useCallback(async (name: string, lastName: string, email: string, password: string, confirmPassword: string) => {
    const data = await apiFetch<{ user: UserSession }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, lastName, email, password, confirmPassword }),
    });
    setUser(data.user);
  }, []);

  // Logout handler: clear cookie on server and local state
  const logout = useCallback(async () => {
    await apiFetch<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, refreshSession }),
    [user, isLoading, login, register, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to access auth context from any component
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }
  return context;
}
