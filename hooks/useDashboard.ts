import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"

export interface DashboardStats {
  activeDeals: number
  upcomingDeadlines: number
  pendingPayments: number
  totalEarnings: number
  trends?: {
    activeDeals?: { value: string; positive: boolean }
    totalEarnings?: { value: string; positive: boolean }
  }
}

export interface DashboardDeadline {
  id: string
  brand: string
  deliverable: string
  dueDate: string
  daysLeft: number
  platform: string
}

export interface DashboardDeal {
  _id: string
  brandName: string
  amount: number
  status: string
  deliverables: Array<{ type: string }>
}

interface DashboardResponse {
  success: boolean
  data: {
    stats: DashboardStats
    upcomingDeadlines: DashboardDeadline[]
    recentDeals: DashboardDeal[]
  }
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await api.get<DashboardResponse>("/api/dashboard")
      return data.data
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to load dashboard"
      toast.error(message)
    }
  })
}