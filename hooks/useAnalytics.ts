import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface AnalyticsResponse {
  success: boolean
  data: {
    overviewStats: {
      totalDeals: number
      totalEarnings: number
      avgDealValue: number
    }
    monthlyDeals: Array<{ month: string; deals: number }>
    earningsData: Array<{ month: string; earned: number }>
    paymentStatus: Array<{ name: string; value: number }>
    platformBreakdown: Array<{ platform: string; deals: number }>
    highlights: Array<{ id: number; text: string; type: "warning" | "success" | "info" }>
  }
}

export type AnalyticsData = AnalyticsResponse["data"]

export function useAnalytics(enabled = true): UseQueryResult<AnalyticsData, unknown> {
  return useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    enabled,
    queryFn: async () => {
      const { data } = await api.get<AnalyticsResponse>("/api/analytics")
      return data.data
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to load analytics"
      toast.error(message)
    }
  })
}