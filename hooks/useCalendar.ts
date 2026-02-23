import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"

export interface CalendarEvent {
  id: string
  brand: string
  type: string
  date: string
  platform: string
}

interface CalendarResponse {
  success: boolean
  data: CalendarEvent[]
}

export function useCalendar(params: { month: number; year: number }) {
  return useQuery({
    queryKey: ["calendar", params],
    queryFn: async () => {
      const { data } = await api.get<CalendarResponse>("/api/calendar", { params })
      return data.data
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to load calendar"
      toast.error(message)
    }
  })
}