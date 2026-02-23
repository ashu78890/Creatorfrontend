import { useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface BillingStatusResponse {
  success: boolean
  data: {
    pricingPlan: "free" | "pro"
    subscriptionStatus: string
    stripeCustomerId?: string
    stripeSubscriptionId?: string
  }
}

export function useBillingStatus() {
  const query = useQuery<BillingStatusResponse["data"], Error>({
    queryKey: ["billing", "status"],
    queryFn: async () => {
      const { data } = await api.get<BillingStatusResponse>("/api/billing/status")
      return data.data
    }
  })

  useEffect(() => {
    if (!query.error) return
    const message = (query.error as any)?.response?.data?.message || "Failed to load billing status"
    toast.error(message)
  }, [query.error])

  return query
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ success: boolean; data: { url: string } }>("/api/billing/checkout")
      return data.data
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to start checkout"
      toast.error(message)
    }
  })
}

export function useCreatePortalSession() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ success: boolean; data: { url: string } }>("/api/billing/portal")
      return data.data
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to open billing portal"
      toast.error(message)
    }
  })
}