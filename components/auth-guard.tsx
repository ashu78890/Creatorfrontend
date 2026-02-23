"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { useSettings } from "@/hooks/useSettings"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  const { isLoading, isError } = useSettings({ enabled: !!token })

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace("/auth/login")
    }
  }, [token, hasHydrated, router])

  useEffect(() => {
    if (isError) {
      router.replace("/auth/login")
    }
  }, [isError, router])

  if (!hasHydrated || !token || isLoading) {
    return null
  }

  return <>{children}</>
}