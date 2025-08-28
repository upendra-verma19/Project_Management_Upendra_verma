"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  checkAuth: () => boolean;
  initializeAuth: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),

      logout: () => {
        set({ user: null, isAuthenticated: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      },

      // Helper method to check if user is authenticated
      checkAuth: () => {
        const { user } = get();
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        return !!(user && token);
      },

      // Initialize auth state from localStorage
      initializeAuth: () => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token && !get().user) {
            // Token exists but no user in store - this might happen on page refresh
            // You might want to verify the token with the backend here
            set({ isAuthenticated: !!token });
          }
        }
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // persist user data and auth state
    }
  )
);

export default useAuthStore;
