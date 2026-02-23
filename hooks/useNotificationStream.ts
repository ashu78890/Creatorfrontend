import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/store/authStore"
import { apiBaseUrl } from "@/lib/api"
import type { NotificationItem } from "@/hooks/useNotifications"

export function useNotificationStream() {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!token) return

    const baseUrl = apiBaseUrl || ""
    const streamUrl = `${baseUrl}/api/notifications/stream?token=${token}`
    const source = new EventSource(streamUrl)

    const handleNotification = (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data) as NotificationItem
        queryClient.setQueriesData({ queryKey: ["notifications"] }, (old: any) => {
          if (!old) {
            return { notifications: [payload], unreadCount: 1 }
          }

          const exists = old.notifications.some((item: NotificationItem) => item._id === payload._id)
          if (exists) return old

          const notifications = [payload, ...old.notifications].slice(0, old.notifications.length || 20)
          const unreadCount = (old.unreadCount || 0) + (payload.readAt ? 0 : 1)
          return { ...old, notifications, unreadCount }
        })
      } catch {
        return
      }
    }

    source.addEventListener("notification", handleNotification)
    source.onerror = () => {
      source.close()
    }

    return () => {
      source.removeEventListener("notification", handleNotification)
      source.close()
    }
  }, [token, queryClient])
}
