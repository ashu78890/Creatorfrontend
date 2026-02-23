import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"

export interface NotificationItem {
  _id: string
  type: "deal_created" | "payment_received" | "deadline_reminder" | "billing_event"
  title: string
  message: string
  readAt?: string | null
  createdAt: string
  metadata?: Record<string, unknown>
}

interface NotificationsResponse {
  success: boolean
  data: {
    notifications: NotificationItem[]
    unreadCount: number
  }
}

export function useNotifications(limit = 20) {
  return useQuery({
    queryKey: ["notifications", limit],
    queryFn: async () => {
      const { data } = await api.get<NotificationsResponse>("/api/notifications", { params: { limit } })
      return data.data
    },
    refetchInterval: 30000,
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to load notifications"
      toast.error(message)
    }
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch("/api/notifications/read")
      return data
    },
    onSuccess: () => {
      queryClient.setQueriesData({ queryKey: ["notifications"] }, (old: any) => {
        if (!old) return old
        const updated = old.notifications.map((item: NotificationItem) => ({
          ...item,
          readAt: item.readAt || new Date().toISOString()
        }))
        return { ...old, notifications: updated, unreadCount: 0 }
      })
    }
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/api/notifications/${id}/read`)
      return data
    },
    onSuccess: (_data, id) => {
      queryClient.setQueriesData({ queryKey: ["notifications"] }, (old: any) => {
        if (!old) return old
        const updated = old.notifications.map((item: NotificationItem) =>
          item._id === id ? { ...item, readAt: new Date().toISOString() } : item
        )
        const unreadCount = updated.filter((item: NotificationItem) => !item.readAt).length
        return { ...old, notifications: updated, unreadCount }
      })
    }
  })
}
