import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AuthUser {
  _id: string
  name?: string
  firstName?: string
  lastName?: string
  email: string
  avatar?: string
  phone?: string
  currency?: string
  pricingPlan?: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  hasHydrated: boolean
  setAuth: (token: string, user: AuthUser) => void
  setUser: (user: AuthUser | null) => void
  setToken: (token: string | null) => void
  clearAuth: () => void
  setHasHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasHydrated: false,
      setAuth: (token, user) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", token)
        }
        set({ token, user })
      },
      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (typeof window !== "undefined") {
          if (token) localStorage.setItem("authToken", token)
          else localStorage.removeItem("authToken")
        }
        set({ token })
      },
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken")
        }
        set({ token: null, user: null })
      },
      setHasHydrated: (value) => set({ hasHydrated: value })
    }),
    {
      name: "creatorflow-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)