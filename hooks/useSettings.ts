import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useAuthStore, type AuthUser } from "@/store/authStore"

interface SettingsResponse {
  success: boolean
  data: AuthUser & {
    notifications?: {
      deadlineReminders: boolean
      paymentAlerts: boolean
      weeklyDigest: boolean
      marketingEmails: boolean
    }
    reminders?: {
      daysBefore: number
      reminderTime: string
    }
    platforms?: string[]
    customPlatforms?: string[]
    dealTypes?: string[]
    monthlyVolume?: string
  }
}

export function useSettings(options?: { enabled?: boolean }) {
  const setUser = useAuthStore((state) => state.setUser)
  return useQuery({
    queryKey: ["settings"],
    enabled: options?.enabled,
    queryFn: async () => {
      const { data } = await api.get<SettingsResponse>("/api/settings")
      setUser(data.data)
      return data.data
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to load settings"
      toast.error(message)
    }
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)
  return useMutation({
    mutationFn: async (payload: Partial<SettingsResponse["data"]>) => {
      const { data } = await api.put<SettingsResponse>("/api/settings", payload)
      return data.data
    },
    onSuccess: (user) => {
      setUser(user)
      toast.success("Settings updated")
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update settings"
      toast.error(message)
    }
  })
}