"use client";

import { createContext, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AuthContextType, User } from "../types/auth";
import {
  getAccessToken,
  decodeToken,
  isTokenExpired,
  clearTokens,
} from "../utils/token";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const logout = useCallback(() => {
    clearTokens();
    router.push("/login");
  }, [router]);

  let user: User | null = null;
  let shouldRedirect = false;
  let shouldShowAccessDeniedToast = false;

  const token = getAccessToken();
  if (token) {
    if (isTokenExpired(token)) {
      shouldRedirect = true;
    } else {
      const decoded = decodeToken(token);
      if (!decoded?.role) {
        shouldRedirect = true;
      } else if (decoded.role !== "admin") {
        shouldRedirect = true;
        shouldShowAccessDeniedToast = true;
      } else {
        user = {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
        };
      }
    }
  }

  useEffect(() => {
    if (!shouldRedirect) return;
    clearTokens();
    if (shouldShowAccessDeniedToast) {
      toast.error("Access denied. Admin role required.");
    }
    router.push("/login");
  }, [router, shouldRedirect, shouldShowAccessDeniedToast]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading: false, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
