"use client";

import { useState, useEffect, useCallback } from "react";
import { AuthState } from "@/types/auth";
import { VALID_USERNAME, AUTH_STORAGE_KEY } from "@/lib/constants";

const INITIAL_STATE: AuthState = {
  isAuthenticated: false,
  username: null,
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: AuthState = JSON.parse(stored);
        if (parsed.isAuthenticated && parsed.username === VALID_USERNAME) {
          setAuthState(parsed);
        }
      }
    } catch {
      // Invalid stored data — ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    (username: string): { success: boolean; error?: string } => {
      const trimmed = username.trim().toLowerCase();

      if (trimmed !== VALID_USERNAME) {
        return { success: false, error: "Invalid username. Access denied." };
      }

      const newState: AuthState = {
        isAuthenticated: true,
        username: trimmed,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
      setAuthState(newState);
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState(INITIAL_STATE);
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    username: authState.username,
    isLoading,
    login,
    logout,
  };
}
